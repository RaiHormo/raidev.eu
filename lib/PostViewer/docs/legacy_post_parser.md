# Post Parser
The original post parser was fistly designed for flexibility, offering to write with pure **html**, but using symbol sets for representing certain tags.
It has priorities of replacing these symbols in decline order in this table down there.

# Symbol list
| Symbols                     | Representation                                    | Exclusivity       |
| --------------------------- | ------------------------------------------------- | ----------------- |
| `T=>(title)<=T`             | Title for the post                                |                   |
| `/*` or `*/`                | `*`                                               |                   |
| `\<` or `\>`                | `<` or `>`                                        |                   |
| `!!!! (text) !!!!`          | `<h1>(text)</h1>`                                 |                   |
| `ilcr- (img) -ilcr`         | `<img src="(CR/image/)(img)">`                    | CharacterRegister |
| `il- (img) -il`             | `<img src="(PostS/image/)(img)">`                 | PostStorage       |
| `i- (img) -i`               | `<img src="(img)">`                               |                   |
| `\"`                        | `\"`                                              |                   |
| `"->(sth)<-"`               | `<div>(sth)</div>`                                |                   |
| `"{(id)} (sth)} "`          | `<div id="(id)">(sth)</div>`                      |                   |
| `*}`                        | `}`                                               |                   |
| `" (sth) "`                 | `<div>(sth)</div>`                                |                   |
| `[ (sth) ]`                 | `<i>[(sth)]</i>`                                  |                   |
| `*"(sth)"*`                 | `"(sth)"`                                         |                   |
| `<<cr (link)>\|<(sth) cr>>` | `<a target="_blank" href="(CR/)(link)">(sth)</a>` | CharacterRegister |
| `<<l (link)>\|<(sth) l>>`   | `<a target="_blank" href="../(link)">(sth)</a>`   | Parent Directory  |
| `<< (link)>\|<(sth) >>`     | `<a target="_blank" href="(link)">(sth)</a>`      |                   |
| `" ##| (hidden) <\| "`      | `<span style="...">(hidden)<span>`                | PostViewer css    |
| `" -- (listed) \|-- "`      | `<li>(listed)</li>`                               |                   |
| `>-> (further) >->`         | `<dir>(further)</dir>`                            |                   |
| `>q> (quote) >q>`           | `<blockquote style="...">(quote)</blockquote>`    | PostViewer css    |
| `\|S- (css) -S\|`           | `<style>(quote)<style>`                           |                   |
| `\|$- (src.js) -$\|`        | `<script type="module" src="(src.js)"></script>`  |                   |
| `\|$ (js) $\|`              | `<script type="module">(js)</script>`             |                   |
| `!\|`                       | `<br>`                                            |                   |
