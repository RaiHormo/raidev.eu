# PostViewer in your webpage
This `.md` would direct how to host you own posts and have the same features,
then that is `.md` would help you out.

# Set up
If you want to embed the webpage and not to spend crucial seconds to copy,
maintain and regularely update PostViewer's code, you can embed using `<iframe>` tag in HTML structure.
In `src` parameter inside of the tag is going to be magic.
To put your page into the block, you can insert with url of PostViewer the url of storage as the argument to url.

`<iframe src="https://ivan-krul.github.io/PostViewer/index.html?(your arguments here)"></iframe>`

To embed your future directory to the system, you should use `direct_storage` url argument to look for posts there.

`?direct_storage=https://foo.bar/posts`

> [!WARNING]
> Ensure that all elements in the directory are accesible externally. It will use interface of access as for directories with slash`/`.
> Also argument doesn't need parentacies.

If you have done that, congratulation, you have just embeded the PostViewer to your webpage.

# Directory enviroument
That section would help you out with the enviroument of the post directory.

## partitions.txt
The file that located at the relative root to the post directory. It is filled with filenames of post files. 
PostViewer automatically picks from `/posts/` directory. It usually looks like this.
```
2024_(10)Oct_03_1.crp
2024_(10)Oct_07_1.crp
2024_(10)Oct_20_1.crp
2024_(11)Nov_02_1.crp
2024_(11)Nov_06_1.crp
2024_(11)Nov_30_1.crp
```
In browser, it would show a list of filenames. Due to a limitation, you can not see titles you have typed in the post file itself.
Instead, you can type titles in `partitions.txt` separated with tabulation. It would be compatable with entries without titles.
```
2025_(1)Jan_05_1.crp \t #1 Week: new rocket parser
2025_(1)Jan_12_1.crp \t #2 Week: lazy
2025_(1)Jan_19_1.crp \t #3 Week: very lazy
2025_(1)Jan_26_1.crp \t #4 Week: very very lazy
```

## /posts/
The directory, where you store all posts. You can paste into separated files the input from Post Constructor.
For naming you should use date as the name of the file. Following with this pattern: `YYYY_(M)MONTHNAME{3}_DD_COUNT`.
Extension is free to set.

## /image/
The directory, where you store all images.

# "post" argument
The argument, that let you show a post, or it would show a browser if it would not have an argument.
If you specify the argument with dot`.`, it would definitely show a single post. The Viewer has a 
capibility to show multiple posts. For that you can put in the argument a number to show the most recent posts.
The number is a limit how much posts it would show.

# Forced stylesheet
If you want to have your own style into your version, then you can pass into url argument also `direct_style` like so.

`?direct_style="abc.css"&direct_storage=https://foo.bar/posts`

> [!NOTE]
> The argument can be accepted with parentacies or without.

With that, you can embed your own style.

