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

[Demo app](https://ng-interceptors.netlify.com)

## Why use HTTP Interceptors

Interceptors can provide a convenient location to apply functionality across all or some network requests and responses. As your application grows re-implementing the same logic becomes tedious, error prone, and potentially results in inconsistent functionality. For example, setting up an Authorization Header across multiple network requests can quickly lead to duplicate code at the service or component level. By utilizing an interceptor, it can be configured once and applied on all current and future HTTP requests. By abstracting global network logic to a single responsibility class, we make it easier to test and build reliable applications quickly.

## Intercepting Requests

Requests can be controlled with the `HttpHandler` that's passed to interceptor methods. In it's simplest usage, if you don't want to modify the request, you can return the `handle` method. Typically used like this.

```ts
intercept(req: HttpRequest<any>, next: HttpHandler) {
  return next.handle(req)
}
```

This is where you can modify [Auth headers](https://angular.io/guide/http#set-default-headers) or anything else related to the request.

## Intercepting Responses

To interact with the response, you'll `pipe` off the `handle` method. From there you can interact with other services such as adding to a cache like you'll see below or modifying the response in the XML to JSON exampling.

Be aware that there may be other events beside the response so it's a good idea to check for an `HttpResponse` before acting on the response event.

```ts
return next.handle(req).pipe(
  tap((event: HttpEvent<any>) => {
    // There may be other events besides the response.
    if (event instanceof HttpResponse) {
      cache.set(req.urlWithParams, {
        key: req.urlWithParams,
        body: event.body,
        dateAdded: Date.now(),
      });
    }
  })
);
```

## Examples

### Caching

Caching, specifically [cache invalidation](https://martinfowler.com/bliki/TwoHardThings.html), can be quite difficult so this article will skip the specifics on that. However initiating the logic that determines when to return a cached response is handled nicely by an interceptor. For a given endpoint you can cache the results in a number of ways and return the cache based on time, existence, or  another factor. For example, data fetched within 2 minutes could be returned from the cache.

The following example checks for the existence in the cache and returns it..

```ts
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // continue request if not cachable.
    if (!this.canCache(req)) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req.urlWithParams);
    // return HttpResponse so that HttpClient methods return a value
    return cachedResponse
      ? of(new HttpResponse({ body: cachedResponse.body }))
      : sendRequest(req, next, this.cache);
  }

  canCache(req: HttpRequest<any>): boolean {
    // only cache `todo` routes
    return req.url.includes('todos');
  }
}
```

If the request is not in the cache, it makes the request as normal with `sendRequest`.

```ts
function sendRequest(
  req: HttpRequest<any>,
  next: HttpHandler,
  cache: CacheService
): Observable<HttpEvent<any>> {
  // No headers allowed in npm search request
  const noHeaderReq = req.clone({ headers: new HttpHeaders() });

  return next.handle(noHeaderReq).pipe(
    tap(event => {
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        cache.set(req.urlWithParams, {
          key: req.urlWithParams,
          body: event.body,
          dateAdded: Date.now(),
        });
      }
    })
  );
}
```

Here we `pipe` off the `handle` method to interact with the response and set it in the cache. Now if the same request is made it will be found in the above code

```ts
 const cachedResponse = this.cache.get(req.urlWithParams);
 ```

### Xml to json

Often developers don’t have complete control over how they get data. For example, if you have one API that returns XML but the rest of your app works with JSON it might make sense to convert the XML response to JSON for consistency. With an interceptor the XML conditional logic can be abstracted away from consumers and be applied to all network requests.

```ts
export class XmlInterceptor implements HttpInterceptor {
  constructor(@Inject(XmlParser) private xml: XMLParser) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // extend server response observable with logging
    return next.handle(req).pipe(
      // proceed when there is a response; ignore other events
      filter(event => event instanceof HttpResponse),
      map(
        (event: HttpResponse<any>) => {
          if (this.xml.validate(event.body) !== true) {
            // only parse xml response, pass all other responses to other interceptors
            return event;
          }

          // {responseType: text} expects a string response
          return event.clone({ body: JSON.stringify(this.xml.parse(event.body)) });
        },
        // Operation failed; error is an HttpErrorResponse
        error => event
      )
    );
  }
}
```

In order to handle the response, this logic is `pipe`'ed off of the `handle` method. Then if the response is valid XML, we return the cloned response `event` and parse the XML into JSON.

### Redirect based on scopes

When an application needs to restrict access to certain routes, an interceptor can provide that functionality in one place across many routes. Since interceptors are run for every request you can co-locate your route guard logic in one place. Once you’ve you’ve set up the appropriate logic based on the requested route and the available scopes the user has your interceptor can determine whether to allow the request or redirect to an appropriate page.

```ts
export class ScopesInterceptor implements HttpInterceptor {
  constructor(private scopesService: ScopesService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // not protected, pass request through
    if (!this.scopesService.protectedRoutes(req.urlWithParams)) {
      return next.handle(req);
    }

    // route is protected, only allow admins
    if (this.scopesService.isAdmin) {
      return next.handle(req);
    } else {
      // not admin, redirect and cancel request
      this.router.navigate(['404']);
      return of(undefined);
    }
  }
}
```

In this example, if the route isn't protected we don't take any action. If it is, we let the request go through if the user is an admin otherwise we redirect and cancel the request.

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

Interceptors pass request through in the order that they're [provided](https://angular.io/guide/http#provide-the-interceptor) in, `[A,B,C]`. The following "barrel" example gathers interceptors to later be provided in their specific order.

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

As we’ve seen in these examples, interceptors provide a straightforward mechanism to interact with HTTP requests and responses. This makes it easy to add layers of control and provide more functionality throughout your application without duplicating logic.

## Helpful links

Angular docs - https://angular.io/guide/http#intercepting-requests-and-responses
Demo app - https://ng-interceptors.netlify.com