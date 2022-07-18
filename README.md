# roam-show-favicon

Roam Research extension that will display the favicon (small website icon) for any http links.

This extension can be installed using Roam Depot.




## Future improvement

- make the options configurable by the user, namely
  * set the icon size: values between 14px and 18px work well
  * set the position of the icon: left or right
  * set the padding between the icon and link
  * set the icon provider: google, duckduckgo, yandex, etc
  * use 32px icons (instead of the default 16px), which might make sense for retina displays
- cache the favicon somehow
- handle the case of missing favicon (404) - duckduckgo already handles this using a default icon, but the other don't
- add some information about which providers seem to work best (example: duckduckgo doesn't seem to work well sometimes; essay.app, lisboaparapessoas.pt, etc)
- consider circular background? example: https://markheath.net/post/font-awesome-circle-background
