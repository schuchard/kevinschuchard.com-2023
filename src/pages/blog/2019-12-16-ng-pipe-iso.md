---
templateKey: blog-post
title: Angular ISO Date Pipe
date: 2019-12-15T00:00:00.000Z
description: The Angular Date pipe can do more than format local time. You can also work with any offset, such as zero UTC offset.
tags:
  - angular
  - pipes
  - datetime
---

# Angular Date Pipe

The Angular Date pipe is fantastic at formatting the majority of date-time manipulations. For example when you provide a date-time string to the `date` pipe it translates it to a more human readable format

```ts
const today = new Date(); # Mon Dec 16 2019 21:24:30 GMT-0700 (Mountain Standard Time)
...
{{today | date}} # Dec 16, 2019
```

Formatting the date-time is available in a number of ways, such as the pre-defined [formats](https://angular.io/api/common/DatePipe#pre-defined-format-options) or your own custom ones.

```html
{{today | date:'medium'}} # Dec 16, 2019, 9:24:30 PM
```

For most, this is exactly what you want, the date and local time of the user. But what if you’re dealing with [ISO](https://en.wikipedia.org/wiki/ISO_8601) date-time [strings](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) that are zero UTC offset. The previous example is not displaying a zero offset time. That time would be:

```text
04:24:30.893Z
```

The Angular Date pipe defaults to local time. Fortunately, this is easily adjusted by providing the offset to the pipe as the 2nd [argument](https://angular.io/api/common/DatePipe#parameters): `'+0:00'`.

```html
{{ today | date:'HH:mm:ss':'+0:00' }}

# 04:24:30
```

You can achieve a [simplified extended ISO format](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString) (ISO 8601) similar to `.toISOString()` with following date pipe format:

```html
{{ today | date:'yyyy-MM-ddTHH:mm:ss.SSS':'+0:00' }}Z

# 2020-05-07T04:24:30.576Z
```

## Demo

[Stackblitz](https://stackblitz.com/edit/ng-iso-date-pipe?file=src%2Fapp%2Fapp.component.html)