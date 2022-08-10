# roam-show-favicon

A simple Roam Research extension that will display the favicon (small website icon) for any http links.

This extension can be installed using Roam Depot. It doesn't manipulate your notes in any way (in fact it doesn't use the [Roam API](https://roamresearch.com/#/app/developer-documentation/page/tIaOPdXCj)). The icon is added using the css `background-image` property in the `<a>` element relative to the link. For more details see this article: https://css-tricks.com/favicons-next-to-external-links/

Demo:

![demo](https://user-images.githubusercontent.com/2184309/179632500-72cc8496-6e40-4c71-bcf9-07ef700de164.jpg)

## Future improvements

- make the options configurable by the user, namely:
  * set the icon size: values between 14px and 18px work well (default: 16px)
  * set the position of the icon: left or right
  * set the padding between the icon and link (default: 4px)
  * set the icon provider: google, duckduckgo, yandex, etc (default: google)
  * fetch 32px icons from the provider, instead of the default 16px (which might make sense for retina displays?)
- add option to only show favicon when the url/domain is not visible (that is, for cases like this: `[link to website](domain.com)`)?
- handle local/offline case: should we detect it and don't show the favicon at all?
- cache the favicon somehow in localstorage?
- handle the case of missing favicon (404) - retry with a different provider?
  * see: https://stackoverflow.com/questions/3019077/detecting-an-image-404-in-javascript
- add some information about which providers seem to work best; some problems found so far:
  * duckduckgo: essay.app; lisboaparapessoas.pt; (seems to miss many websites... but we can force them to show by making a search?)
  * google: heroku.com (looks like google is ignoring the `<link rel="icon" type="image/x-icon" href="..." />` element?)
- handle URI schemes other then http and https: mailto, file, etc (reference: https://en.wikipedia.org/wiki/List_of_URI_schemes)
- consider circular background? example: https://markheath.net/post/font-awesome-circle-background
