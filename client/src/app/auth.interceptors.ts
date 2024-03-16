import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Get the token from your authentication service
    const token = this.authService.getToken();

    // Skip interception for login and registration requests
    if (
      request.url.includes("login") ||
      request.url.includes("registration")
    ) {
      return next.handle(request);
    }

    // Clone the request and add the Authorization header with the token
    if (token) {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    }

    // Pass the modified request to the next interceptor or to the HTTP handler
    return next.handle(request);
  }
}
