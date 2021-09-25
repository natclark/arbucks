<script>
    import Post from '$lib/components/Blog/Post.svelte';
</script>

<svelte:head>
    <title>Arbitrum Blog - Arbucks</title>
    <link rel="canonical" href="https://arbucks.io/blog/">
    <meta property="og:title" content="Arbitrum Blog - Arbucks">
    <meta name="twitter:title" content="Arbitrum Blog - Arbucks">
</svelte:head>

<h1 class="blog__title">Blog</h1>
<p>A daily blog where we share our progress and publish Arbitrum tutorials, guides, and news.</p>
<div class="flex">
    <a class="primary" href="https://arbucks.io/rss.xml" rel="external" draggable="false">
        <span class="primary__shadow"></span>
        <span class="primary__edge"></span>
        <span class="primary__front">
            <svg width="18px" height="18px" viewBox="0 0 333333 333333" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd">
                <path fill="#fff" d="M44382 244427C19901 244427 6 264387 6 288717c0 24452 19893 44205 44376 44205 24556 0 44437-19754 44437-44205 0-24328-19875-44290-44437-44290zM49 113241v63895c41608 0 80707 16271 110159 45748 29422 29391 45667 68681 45667 110448h64167c0-121341-98731-220072-219993-220072v-20zM130 0v63907c148372 0 269117 120869 269117 269407l64080 6C333327 149577 183829 7 135 7l-6-6z"></path>
            </svg>
            &nbsp;&nbsp;Subscribe via RSS
        </span>
    </a>
</div>

<br>

<Post title="The Path Going Forward" path="the-path-going-forward" time="2021-09-25T00:56:41-07:00" thumbnail="QmaHxZEZv6CwZ1TsNFvoga77CaxUVMp8MPZn93YkFAzL7m">
    This past week has been moving a bit slow for Arbucks (and Arbitrum overall). Here's a recap of what's been going on and what the new plan is going forward.
</Post>

<Post title="Introducing Arbigator, a DEX Aggregator on Arbitrum" path="introducing-arbigator" time="2021-09-23T23:38:32-07:00" thumbnail="QmZteJdSu8vPFp7VrWerfQWqAj2J6Thf3YSKstFcfknvvF">
    With a slick user interface and no extra fees, Arbigator is a useful trading companion and great addition to the Arbitrum charting tools we offer on this site.
</Post>

<Post title="6 Resources for Getting Started With Arbitrum" path="getting-started-with-arbitrum" time="2021-09-22T00:38:55-07:00" thumbnail="QmZUnhHk4PJZ5AFCP5YjrNbbLgcYLnobEwP3bx9dTLnMB3">
    Arbitrum is definitely a "wild west" of new protocols, tokens, and projects. Here's some resources to get your bearings in this fast-paced but exciting new world.
</Post>

<Post title="What's Next For Arbucks" path="whats-next" time="2021-09-20T23:30:35-07:00" thumbnail="QmYC4a8p7qaoqon1dAaSydexp5abru7QdExxE62k5UwbRL">
    This past week has been a wild ride for Arbitrum, and the following weeks might be even wilder. Here's how we're preparing to serve the incoming waves of users.
</Post>

<Post title='Our Manifesto: Helping Arbitrum Users "Make It"' path="our-manifesto" time="2021-09-19T21:16:04-07:00" thumbnail="Qmcp1qATYdgitwTwqdHVSubXdU9rGih8R1p9nNT1J4Q5aJ">
    Rollups are here to stay, but we strongly believe Arbitrum adoption will go ballistic this fall and coming winter. And we want to help you take advantage of that adoption.
</Post>

<Post title="Launch Recap & Future Plans" path="launch-recap" time="2021-09-18T13:35:43-07:00" thumbnail="QmeZRKt24azviAsege6jB2cRq9LPRiF9By2EiM9XbxjRxs">
    Calling our launch "bumpy" would be an understatement. Everything that <em>could</em> have gone wrong, DID go wrong. But we've re-emerged stronger than ever!
</Post>

<style>
    .flex {
        align-items: center;
        display: flex;
        justify-content: center;
    }
    .primary {
        display: block;
        text-align: center;
        max-width: 240px;
        .primary__front {
            align-items: center;
            display: flex;
        }
    }
</style>
