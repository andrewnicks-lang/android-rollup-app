#!/usr/bin/env python3
r"""
build_multi_team_fantasy_data.py — Builds a complete Multi-Team / Multi-User v3.0 dataset
for all 12 teams in ESPN League #945552 ("Weekend Warriors") by delegating directly to
`espn_sync.build_multi_team_bundle_from_data` in `d:\_AI\FF_2026`.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, List

FF_WORKSPACE = Path(r"d:\_AI\FF_2026")
if str(FF_WORKSPACE) not in sys.path:
    sys.path.insert(0, str(FF_WORKSPACE))

from espn_sync import (  # noqa: E402
    auto_protect_names_for_team,
    build_multi_team_bundle_from_data,
    enrich_roster,
    fetch_espn_nfl_injuries_map,
    fetch_espn_nfl_news,
    fetch_espn_nfl_scoreboard,
    fetch_sleeper_trending_adds,
    load_or_fetch_nfl_players,
    try_sync_espn_private_api,
)
from firestore_state import load_env_merged  # noqa: E402
from moneyball_engine import (  # noqa: E402
    build_oline_injury_clusters,
    build_team_injury_vacuums,
)

__all__ = ["auto_protect_names_for_team", "build_all_teams_bundle"]


def build_all_teams_bundle(out_path: Path) -> Dict[str, Any]:
    env = load_env_merged(FF_WORKSPACE)
    league_id = int(env.get("ESPN_LEAGUE_ID", 945552))
    season = int(env.get("ESPN_SEASON", 2026))
    swid = env.get("ESPN_SWID", "").strip()
    espn_s2 = env.get("ESPN_S2", "").strip()

    print(f"[Fantasy Sync v3.0] Fetching live NFL scoreboard, injuries, trends, news & player DB for League #{league_id}...")
    scoreboard = fetch_espn_nfl_scoreboard()
    news_articles = fetch_espn_nfl_news(limit=25)
    nfl_players = load_or_fetch_nfl_players(
        cache_path=FF_WORKSPACE / "state" / "nfl_players_cache.json",
        force_refresh=False,
    )
    injuries_by_norm = fetch_espn_nfl_injuries_map()
    trending_adds_by_norm = fetch_sleeper_trending_adds(nfl_players)

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

    vacuums = build_team_injury_vacuums(nfl_players)
    ol_clusters = build_oline_injury_clusters(nfl_players)

    enriched_fas = enrich_roster(
        raw_free_agents,
        nfl_players,
        scoreboard,
        news_articles,
        injuries_by_norm=injuries_by_norm,
        trending_adds_by_norm=trending_adds_by_norm,
    )

    bundle = build_multi_team_bundle_from_data(
        league_id=league_id,
        season=season,
        scoring_period=scoring_period,
        all_teams_raw=all_teams_raw,
        schedule_raw=schedule_raw,
        nfl_players=nfl_players,
        nfl_players_by_norm=nfl_players_by_norm,
        scoreboard=scoreboard,
        news_articles=news_articles,
        vacuums=vacuums,
        ol_clusters=ol_clusters,
        enriched_fas=enriched_fas,
        league_info=matchup_info.get("league_info"),
        recent_activity=matchup_info.get("recent_activity"),
        injuries_by_norm=injuries_by_norm,
        trending_adds_by_norm=trending_adds_by_norm,
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(bundle, indent=2), encoding="utf-8")
    print(
        f"[Fantasy Sync v3.0] Wrote {len(bundle.get('teams_directory', []))} teams & "
        f"{len(bundle.get('free_agents', []))} FAs to {out_path}"
    )
    return bundle


if __name__ == "__main__":
    target = Path(__file__).resolve().parent.parent / "apps" / "fantasy-manager" / "data" / "league_945552.json"
    build_all_teams_bundle(target)
