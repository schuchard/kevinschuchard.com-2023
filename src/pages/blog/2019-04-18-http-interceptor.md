---
templateKey: blog-post
title: 3 ways to use Angular HTTP Interceptors
date: 2019-04-18T00:00:00.000Z
description:
tags:
  - angular
  - http
---

HTTP Interceptors provide a flexible mechanism to control your application when dealing with network related resources. They’re similar to middleware in other frameworks and allow network logic to be abstracted and reused. This article will focus on three types of interceptors you can use to enhance your application. Caching resources, converting response types, and controlling access based on authorization.

## Why use HTTP Interceptors

Interceptors can provide a convenient location to apply functionality across network requests and responses. As your application grows re-implementing the same logic becomes tedious, error prone, and potentially results in inconsistent functionality. For example, setting up an Authorization Header across multiple network requests can quickly lead to duplicate code at the service or component level. By utilizing an interceptor, it can be configured once and applied on all current and future HTTP requests. By abstracting global network logic to a single responsibility class, we make it easier to test and build reliable applications quickly.

## Caching

Caching, specifically [cache invalidation](https://martinfowler.com/bliki/TwoHardThings.html), can be quite difficult so this article will skip the specifics on that. However initiating the logic that determines when to return a cached response is handled nicely by an interceptor. For a given endpoint you can cache the results in a number of ways and return the cache based on time, presence, or  another factor. For example, data fetched within 2 minutes could be returned from the cache.

```ts
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!isCachable(req)) { return next.handle(req); }

    const cachedResponse = this.cache.get(req);
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}
```

## Xml to json

Often developers don’t have complete control over how they get data. For example, if you have one API that returns XML but the rest of your app works with JSON it might make sense to convert the XML response to JSON for consistency.

```ts
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private xml: XmlToJsonService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (this.xml.parseRoute(req)) {
      return next.handle(noHeaderReq).pipe(
        map(event => {
          // There may be other events besides the response.
          if (event instanceof HttpResponse) {
            return this.xml.parse(event) // Convert Xml to JSON
          }
        })
      );
    }
  }
}
```

## Redirect based on scopes

When an application needs to restrict access to certain routes, an interceptor can provide that functionality in one place across many routes. Since interceptors are run for every request you can co-locate your route guard logic in one place. Once you’ve you’ve set up the appropriate logic based on the requested route and the available scopes the user has your interceptor can determine whether to allow the request or redirect to an appropriate page.

```ts
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler, private auth: AuthService) {
    // continue if not cachable.
    if (this.auth.hasScope(req)) { return next.handle(req); }

    return req.redirect('/404');
  }
}
```

## Immutability

It’s easy to forget that the `HttpRequest` and `HttpResponse` instances are immutable. From the [Angular docs](https://angular.io/guide/http#immutability)
> interceptors are capable of mutating requests and responses, the HttpRequest and HttpResponse instance properties are readonly, rendering them largely immutable.

They do that because the app may retry a request several times and if the interceptor could modify the original request then each subsequent request would be different.

What this means for developers is that you must `clone` the request and modify that instance

```ts
// clone request and replace 'http://' with 'https://' at the same time
const secureReq = req.clone({
  url: req.url.replace('http://', 'https://')
});
// send the cloned, "secure" request to the next handler.
return next.handle(secureReq);
```

## Interceptor order

Interceptors pass request through in the order that they're [provided](https://angular.io/guide/http#provide-the-interceptor) in, `[A,B,C]`. The following is a "barrel" example that gathers interceptors to later be provided in their specific order.

> requests will flow in A->B->C and responses will flow out C->B->A.

```ts
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
];
```

then in app.module.ts

```ts
providers: [
  httpInterceptorProviders
],
```

## Summary
As we’ve seen over these examples, interceptors provide a straightforward mechanism to interact with HTTP requests and responses. This makes it easy to add layers of control and provide more functionality throughout your application.

## Helpful links
Angular docs - https://angular.io/guide/http#intercepting-requests-and-responses

