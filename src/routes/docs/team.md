<script>
    import Profile from '$lib/components/Profile/index.svelte';
</script>

<svelte:head>
    <title>Team - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/docs/team/">
    <meta property="og:title" content="Team - Arbucks">
    <meta name=twitter:title content="Team - Arbucks">
</svelte:head>

# Team

We are a worldwide, remote-first, and pseudonymous/semi-onymous team, focused on building a transparent and self-sustaining platform for Arbitrum analytics.

If you're interested in joining us, please feel free to reach out to a developer on Telegram. While all roles are paid, most roles do not have a time commitment and are entirely voluntary.

## Developers

<div class="flex">
    <Profile picture="QmXoAWx91sBTPvruLWAMks99ZpYRbA3514fBt2KNyPYfMH" telegram="nathanio" title="Founder & Lead Maintainer" description="For a period of time, Arbitrum will be a platform for the most powerful economic vehicles in human history." flag="🇺🇸" />
</div>

## Advisors

<div class="flex">
    <Profile picture="QmTE6mKTaFqTSP4CCsEPMuJiuXW34QXx3SepY9BNvLdMye" telegram="anthony_acevedo" title="General Advisor" description="Trust the plan because trust always makes it happen." flag="🇺🇸" />
    <Profile picture="QmTShCZtrmFH1mtwF8dgG5rs6W4i84kjnKeenrKN9SS12u" telegram="thecryptonator1" title="Telegram Moderator" description="Over 5 years of cryptocurrency and blockchain experience in fields such as marketing, networking and project management." flag="🇦🇺" />
    <Profile picture="QmUuPzjHcWXTxUohvdqHGb1EV2oZtPUzfzqTQZqnzs25ch" telegram="H4shhh" title="Telegram Moderator" description="Arbitrum will soon be a top 3 network, with Arbucks its flagship charting and tools site. Happy to be part of the team." flag="🇬🇧" />
</div>

<div class="flex">
    <Profile picture="QmNQW8hPavpXn7XUotncph68ngvxSfuCPakQyAo5gpLCvc" telegram="Derevlean" title="Graphic Designer" description="7 years of cryptocurrency and blockchain experience in project management & trading/chart analysis." flag="🇷🇴" />
</div>

<style>
    .flex {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        row-gap: 12px;
        &:last-child {
            margin-bottom: 24px;
        }
    }
    @media screen and (min-width: 768px) {
        .flex {
            column-gap: 12px;
            flex-direction: row;
        }
    }
</style>
