---
templateKey: blog-post
title: Rotate & Center Vertical Text
date: 2018-10-27T00:00:00.000Z
description: A responsive way to rotate and center text in its container
tags:
  - angular
  - css
  - center
---

# Centering rotated text in a vertical container

## [Demo](https://aonipgoj.github.stackblitz.io/)

Rotating text is quite simple with the `transform` and `rotate` property.

```css
.rotate90 {
    transform: rotate(90deg)
}
```

Once you rotate the text though, you then might face the issue of positioning. Especially related to a containing element. In this example, I want the rotated text to fit into the layout flow of its sibling and parent elements. That way I can take advantage of things like centering, both vertically and horizontally.

Let’s say we have to columns on each end of a container with some main content in the center, similar to how a ticket might look. I want the outer columns to display vertically rotated and centered text on each end.

Lets use the following HTML as an example.

```html
<div class="container">
    <div class="col"><span class="rotate rotate-up">ABC</span></div>
    <div class="content"><article>Main Content</article></div>
    <div class="col"><span class="rotate rotate-down">ABC</span></div>
</div>
```

First give the `col` `relative`  positioning, then you can `absolute`'ly positing the inner content, in this example the `span` elements.

Next, center the column content. I’ve broken out the styles into two classes, `rotate` and `rotate-up, rotate-down`

```css
.rotate {
    position: absolute;
    top: 50%;
    left: 50%;
}

.rotate-up {
    transform: translateX(-50%) translateY(-50%) rotate(-90deg)
}

.rotate-down {
    transform: translateX(-50%) translateY(-50%) rotate(90deg)
}
```

Now we have rotated text that's dynamically centered both vertically and horizontally within its container. We also can still reason about the outer elements layout in a horizontal way.

# Resources

- [Stackblitz demo](https://stackblitz.com/github/schuchard/rotate-vertical-text-ng)
- [github repo](https://github.com/schuchard/rotate-vertical-text-ng)