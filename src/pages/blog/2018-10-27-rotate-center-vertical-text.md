---
templateKey: blog-post
title: Rotate & Center Vertical Text
date: 2018-10-27T00:00:00.000Z
description: A responsive way to rotate and center text in its container
tags:
  - angular
  - css
  - center
  - demo
---

## [Demo](https://stackblitz.com/github/schuchard/rotate-vertical-text-ng)

Rotating text is quite simple with the `transform` and `rotate` property.

```css
.rotate90 {
    transform: rotate(90deg)
}
```

Once the text is rotated, then you might face the issue of positioning. Especially related to a containing element. In this example, I want to center, horizontally and vertically, the rotated text in its containing element. I also want the containing element to maintain its relative position alongside its sibling elements.

Let’s say we have two columns on each end of a container with some main content in the center, similar to how a ticket might look. I want the outer columns to display vertically rotated and centered text on each end.

Let's use the following HTML as an example.

```html
<div class="container">
    <div class="col"><span class="rotate rotate-up">ABC</span></div>
    <div class="content"><article>Main Content</article></div>
    <div class="col"><span class="rotate rotate-down">ABC</span></div>
</div>
```

First, give the `col` `relative` positioning. Then you can `absolute`'ly positioning the inner content, which in this example are the `span` elements.

Next, center the column content. I’ve broken out the styles into two classes, `rotate` and `rotate-up, rotate-down`.

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

Now we have rotated text that's centered both vertically and horizontally within its container. It's responsive to the container height and width and we can still reason about the layout of the outer elements in a horizontal way if necessary.

# Resources

- [Stackblitz demo](https://stackblitz.com/github/schuchard/rotate-vertical-text-ng)
- [Github repo](https://github.com/schuchard/rotate-vertical-text-ng)