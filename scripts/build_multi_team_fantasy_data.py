#!/usr/bin/env python3
r"""
build_multi_team_fantasy_data.py — Builds a complete Multi-Team / Multi-User dataset
for all 12 teams in ESPN League #945552 ("Weekend Warriors") by leveraging the
deterministic ESPN v3 API & Moneyball 60/40 Engine in `d:\_AI\FF_2026`.
"""

import datetime
import json
import sys
from pathlib import Path
from typing import Any, Dict, List

FF_WORKSPACE = Path(r"d:\_AI\FF_2026")
if str(FF_WORKSPACE) not in sys.path:
    sys.path.insert(0, str(FF_WORKSPACE))

from espn_sync import (  # noqa: E402
    enrich_roster,
    fetch_espn_nfl_news,
    fetch_espn_nfl_scoreboard,
    load_or_fetch_nfl_players,
    try_sync_espn_private_api,
)
from firestore_state import load_env_merged  # noqa: E402
from moneyball_engine import (  # noqa: E402
    PROTECTED_ROCKSTAR_NAMES,
    build_oline_injury_clusters,
    build_opponent_war_room,
    build_team_injury_vacuums,
    normalize_name,
    score_player_moneyball,
    select_moneyball_transaction,
)


def auto_protect_names_for_team(team_id: int, enriched_roster: List[Dict[str, Any]]) -> List[str]:
    """
    For Team #4 (Mahomes Depot), use Andrew's canonical PROTECTED_ROCKSTAR_NAMES.
    For any other team in the league, default-protect their top 6 players by Blended VORP / Season PPG
    (users can toggle protection on/off for any player directly in the app UI!).
    """
    if int(team_id) == 4:
        return [
            p["name"]
            for p in enriched_roster
            if normalize_name(p.get("name", "")) in PROTECTED_ROCKSTAR_NAMES
        ]

    sorted_players = sorted(
        [p for p in enriched_roster if p.get("pos") in ("QB", "RB", "WR", "TE")],
        key=lambda x: (
            float(x.get("blended_vorp") or 0.0),
            float(x.get("season_ppg") or 0.0),
            float(x.get("percent_owned") or 0.0),
        ),
        reverse=True,
    )
    return [p["name"] for p in sorted_players[:6]]


def build_all_teams_bundle(out_path: Path) -> Dict[str, Any]:
    env = load_env_merged(FF_WORKSPACE)
    league_id = int(env.get("ESPN_LEAGUE_ID", 945552))
    season = int(env.get("ESPN_SEASON", 2026))
    swid = env.get("ESPN_SWID", "").strip()
    espn_s2 = env.get("ESPN_S2", "").strip()

    print(f"[Fantasy Sync] Fetching live NFL scoreboard, news & player DB for League #{league_id}...")
    scoreboard = fetch_espn_nfl_scoreboard()
    news_articles = fetch_espn_nfl_news(limit=25)
    nfl_players = load_or_fetch_nfl_players(
        cache_path=FF_WORKSPACE / "state" / "nfl_players_cache.json",
        force_refresh=False,
    )

    team_games = scoreboard.get("team_games", {})
    nfl_week = int(scoreboard.get("week") or 7)

    ok, msg, _, matchup_info, _, raw_free_agents = try_sync_espn_private_api(
        league_id=league_id,
        season=season,
        team_id=4,
        swid=swid,
        espn_s2=espn_s2,
        team_games=team_games,
    )

    if not ok or not matchup_info:
        raise RuntimeError(f"Failed to sync ESPN League #{league_id}: {msg}")

    scoring_period = int(matchup_info.get("scoringPeriodId") or nfl_week)
    all_teams_raw = matchup_info.get("all_teams") or []
    schedule_raw = matchup_info.get("schedule") or []

    nfl_players_by_norm: Dict[str, List[Dict[str, Any]]] = {}
    for p in nfl_players.values():
        nm = p.get("norm_name")
        if nm:
            nfl_players_by_norm.setdefault(nm, []).append(p)

    # Build NFL-wide injury vacuums & O-Line injury clusters
    vacuums = build_team_injury_vacuums(nfl_players)
    ol_clusters = build_oline_injury_clusters(nfl_players)

    # Enrich and score Free Agents once for the entire league
    enriched_fas = enrich_roster(raw_free_agents, nfl_players, scoreboard, news_articles)
    for fa in enriched_fas:
        mb = score_player_moneyball(
            player=fa,
            team_games=team_games,
            vacuums=vacuums,
            news_articles=news_articles,
            nfl_players_by_norm=nfl_players_by_norm,
            ol_clusters=ol_clusters,
        )
        fa.update(mb)

    enriched_fas.sort(
        key=lambda x: (float(x.get("blended_vorp") or -99.0), float(x.get("blended_ppg") or 0.0)),
        reverse=True,
    )

    # First pass: enrich all 12 team rosters so War Room opponent lookups have full Moneyball metrics
    enriched_teams_map: Dict[int, Dict[str, Any]] = {}
    all_teams_for_war_room: List[Dict[str, Any]] = []

    for tm in all_teams_raw:
        tid = int(tm["id"])
        t_roster_raw = tm.get("roster") or []
        t_enriched = enrich_roster(t_roster_raw, nfl_players, scoreboard, news_articles)
        for p in t_enriched:
            mb = score_player_moneyball(
                player=p,
                team_games=team_games,
                vacuums=vacuums,
                news_articles=news_articles,
                nfl_players_by_norm=nfl_players_by_norm,
                ol_clusters=ol_clusters,
            )
            p.update(mb)

        enriched_teams_map[tid] = {
            "id": tid,
            "name": tm["name"],
            "record": tm.get("record") or {},
            "record_str": tm.get("record_str") or "0-0-0",
            "roster": t_enriched,
        }
        all_teams_for_war_room.append(enriched_teams_map[tid])

    # Second pass: compute team-specific War Room, Protected List & Waiver Recommendation for all 12 teams
    teams_output: Dict[str, Dict[str, Any]] = {}
    teams_directory: List[Dict[str, Any]] = []

    for tid, tm_obj in sorted(enriched_teams_map.items(), key=lambda x: x[0]):
        t_roster = tm_obj["roster"]
        protected_display = auto_protect_names_for_team(tid, t_roster)
        protected_norm_set = {normalize_name(nm) for nm in protected_display}

        mb_rec = select_moneyball_transaction(
            enriched_roster=t_roster,
            free_agents=enriched_fas,
            protected_names=protected_norm_set,
            norm_fn=normalize_name,
        )

        war_room = build_opponent_war_room(
            my_team_id=tid,
            current_week=scoring_period,
            all_teams_data=all_teams_for_war_room,
            schedule_data=schedule_raw,
            enriched_roster=t_roster,
            free_agents=enriched_fas,
            protected_names=protected_norm_set,
            norm_fn=normalize_name,
        )

        rec_drop = (mb_rec.get("drop_player") or {})
        default_drop = {
            "id": int(rec_drop.get("player_id") or 0),
            "name": rec_drop.get("name", "Bench Floor"),
            "full_label": f"{rec_drop.get('name', 'Bench')} ({rec_drop.get('pos', '')}, {rec_drop.get('nfl_team', '')})",
            "moneyball_vorp": float(rec_drop.get("moneyball_vorp") or 0.5),
            "consensus_vorp": float(rec_drop.get("consensus_vorp") or 0.5),
        }

        teams_output[str(tid)] = {
            "team_id": tid,
            "team_name": tm_obj["name"],
            "record": tm_obj["record"],
            "record_str": tm_obj["record_str"],
            "default_protected_names": protected_display,
            "default_drop": default_drop,
            "roster": t_roster,
            "moneyball_recommendation": mb_rec,
            "war_room": war_room,
        }

        teams_directory.append({
            "team_id": tid,
            "team_name": tm_obj["name"],
            "record_str": tm_obj["record_str"],
            "points_for": round(float((tm_obj["record"] or {}).get("pointsFor") or 0.0), 1),
            "starter_proj": war_room.get("my_projected_pts", 0.0),
        })

    bundle = {
        "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %I:%M %p CT"),
        "espn_api_live": True,
        "week": scoring_period,
        "season": season,
        "league": {
            "league_id": league_id,
            "name": "Weekend Warriors",
            "season": season,
            "num_teams": len(teams_directory),
            "scoring_format": "Full-PPR (2-FLEX, No Kicker)",
            "lineup_slots": {"QB": 1, "RB": 2, "WR": 2, "TE": 1, "FLEX": 2, "DST": 1, "K": 0},
        },
        "teams_directory": teams_directory,
        "teams": teams_output,
        "free_agents": enriched_fas[:65],
        "oline_clusters": ol_clusters,
        "breaking_news": news_articles[:18],
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(bundle, indent=2), encoding="utf-8")
    print(f"[Fantasy Sync] Wrote {len(teams_directory)} teams & {len(enriched_fas[:65])} FAs to {out_path}")
    return bundle


if __name__ == "__main__":
    target = Path(__file__).resolve().parent.parent / "apps" / "fantasy-manager" / "data" / "league_945552.json"
    build_all_teams_bundle(target)
