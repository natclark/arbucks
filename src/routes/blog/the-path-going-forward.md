<svelte:head>
    <title>The Path Going Forward</title>
    <link rel="canonical" href="https://arbucks.io/blog/the-path-going-forward/">
    <meta property="og:title" content="The Path Going Forward - Arbucks">
    <meta name="twitter:title" content="The Path Going Forward - Arbucks">
</svelte:head>

<h1 id="the-path-going-forward" class="blog__title">
    <a href="#the-path-going-forward">The Path Going Forward</a>
</h1>

<p><time datetime="2021-09-19T21:16:04-07:00">September 25, 2021</time></p>

<img class="blog__image blog__image--contain" src="https://cloudflare-ipfs.com/ipfs/QmaHxZEZv6CwZ1TsNFvoga77CaxUVMp8MPZn93YkFAzL7m" alt="Image of an animated sunrise" loading="lazy">

The past week was a bit slow for Arbucks and the greater Arbitrum ecosytem.

There's a number of reasons for this, but I'd like to focus on the path going forward for Arbucks in this post.

First of all, the biggest challenge since the Monday before last was that the Arbitrum RPC was timing out on certain requests, thereby desynchronizing our data.

The Arbitrum team has released a new node version yesterday, and real-time data has since been restored, *with the exception of TradingView charts*.

This RPC fix was implemented sooner than expected. And before it was implemented, we were on track to:

- Release Arbigator on Sept. 23

- Release ArbiDAO on Sept. 24

- Release Arbucks Pro on Sept. 25

Those release dates were enumerated in our [previous status update](https://arbucks.io/blog/whats-next/).

They've since changed, because once real-time data was restored, my focus shifted to fixing candlestick rendering issues on TradingView charts.

We've been transitioning to TradingView charts on this site for a little while now, but lots of the transition could not be finished until real-time data was restored.

But I'm getting really close to wrapping things up and am running a script in the background as we speak that should correctly recalculate all the candles by tomorrow.

Anyway, I began rolling out Arbigator on Sept. 24 and will soon fix it up and add all the features you people have been requesting.

However, the ArbiDAO and Arbucks Pro launches have been postponed until further notice (they'll still be released of course - it's just a matter of when).

My top priority is focusing on fixing charts and improving Arbigator, and once that's done, my focus will shift back to ArbiDAO and Arbucks Pro.

Things should move much faster from there.

## Conclusion

The silver lining here is that it looks like real-time data is back **for good** now, although the early data resync has pushed back some release dates.

Anyway, I really appreciate all of you following this journey, despite the fact that charts are having some issues as of writing this.