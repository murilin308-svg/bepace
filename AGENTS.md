<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- News imagery in the news page shows three distinct source images distributed one near the top (lead), one in the middle, and one near the end of the article list, replacing failed images with the nearest available article image; this keeps photos authentic without extra news API calls.
- Keep authentication presentation in the existing auth route and scoped auth CSS, preserving its sign-in, signup, and recovery handlers when restyling so visual changes do not alter account behavior.
