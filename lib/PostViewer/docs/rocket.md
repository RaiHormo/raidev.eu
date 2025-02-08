# Post Rocket
The parser that is designed as a replacement for original post parser. To safe compatability it was made as version. To make that version work, type this code at the most beginning.

`V=> rocket <=V`

It is the parser with main goal to reduce symbols and use concept of "rockets".
They are representing a simple way to make tags possible and save space.

# Symbol rule
That order of first 2 lines is necessary to work.
```
V=> rocket <=V
-- (title) --
```

Rockets are beginning from the flame `~`.
and rockets ends from tip `>`.
Like so `~>`, you can make a representation of `<div>` wrap.
Text should be under the rocket as a single line.
```
~>
(text)
```
as
`<div>(text)<div>`
This scheme works for every rocket with some exceptions.

In rockets can be only **1** load.
Rockets are not useful.
You can load:
 - goods
 - fuel
 - radar
 - body

With goods you can use rockets' representation of tags:
`~&>`   - this rocket carries html tag
`~I>`   - this rocket carries image tag (in content it accepts the link)
`~IL>`  - this rocket carries image tag (same for `~I>`, but for image directory in Post-like repos only)
`~CSS>` - this rocket carries css tag
`~JS>`  - this rocket carries js
`~JS&>` - this rocket carries js module

With fuel you can use rockets' multiline text:
```
~|
more
text
|>
```
In fuel rockets you can also put goods inside:
```
~JS|
document.body += "<div id="boc">this was rendered</div>";
document.body += "<div id="ocb">there</div>";
|>
```

With radar you can link you webpages. It has to be an argument to the radar. 
```
~L)https://wikipedia.org)>
Here's the link to the wikipedia
~>
!
```
Radar rockets would not move the content to the newline. To create a line with a rocket radar, you have to put the rocket radar inside the rocket body
```
~=
I'm presenting...
~L)https://wikipedia.org)>
Here's the link to the wikipedia
=
 and thanks for the presentation
=>
```


With body, you can put multiple rockets inside the rocket. You can put goods within.
```
~&=
  <div id="abc">
~I>
  ./image/symbol of currency S.png
~>
  man doin this stuff is insane
=
  </div>
=>
```
