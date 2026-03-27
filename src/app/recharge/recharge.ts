import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, finalize } from 'rxjs/operators';
import { Recharge as RechargeService } from '../service/recharge';

@Component({
  selector: 'app-recharge',
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './recharge.html',
  styleUrl: './recharge.css',
})
export class Recharge implements OnInit, OnDestroy {

  // ------------------- UI State -------------------
  mobile = '';
  amount = 0;
  response = '';
  responseTime = '';
  isLoading = false;
  mobileError = '';

  // ------------------- Internals -------------------
  private readonly MOBILE_REGEX = /^[6-9]\d{9}$/;
  private readonly destroy$ = new Subject<void>();
  private readonly mobileInput$ = new Subject<string>();

  // ✅ Centralized HTTP Error Messages
  private readonly HTTP_ERROR_MESSAGES: Record<number, string> = {
    300: 'Multiple options available.',
    301: 'Resource moved permanently.',
    302: 'Resource moved temporarily.',
    304: 'Content not modified.',

    400: 'Bad request.',
    401: 'Unauthorized.',
    403: 'Access denied.',
    404: 'Resource not found.',
    405: 'Method not allowed.',
    408: 'Request timeout.',
    409: 'Conflict occurred.',
    410: 'Resource gone.',
    413: 'Payload too large.',
    415: 'Unsupported media type.',
    422: 'Invalid data.',
    429: 'Too many requests.',

    500: 'Internal server error.',
    502: 'Bad gateway.',
    503: 'Service unavailable.',
    504: 'Gateway timeout.'
  };

  constructor(
    private readonly rechargeService: RechargeService,
    private readonly cdr: ChangeDetectorRef // 🔥 FIX for UI update in zoneless mode
  ) {}

  // ------------------- Lifecycle -------------------
  ngOnInit(): void {
    this.mobileInput$
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.mobileError = this.validateMobile(value);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ------------------- Validation -------------------
  private validateMobile(mobile: string): string {
    const val = mobile.trim();

    if (!val) return '';
    if (!/^\d+$/.test(val)) return 'Only digits are allowed.';
    if (!/^[6-9]/.test(val)) return 'Must start with 6–9.';
    if (val.length !== 10) return 'Mobile number must be 10 digits.';
    if (!this.MOBILE_REGEX.test(val)) return 'Invalid mobile number.';

    return '';
  }

  // ------------------- Input -------------------
  onMobileInput(): void {
    this.mobileInput$.next(this.mobile);
  }

  allowOnlyNumbers(event: KeyboardEvent): void {
    if (event.key < '0' || event.key > '9') {
      event.preventDefault();
    }
  }

  // ------------------- Helpers -------------------
  private formatDuration(ms: number): string {
    return `Response time: ${ms.toFixed(0)} ms (${(ms / 1000).toFixed(2)} s)`;
  }

  private handleHttpError(err: any): string {
    if (err.status === 0) {
      return '⚠️ Server not reachable. Check backend.';
    }

    const msg = this.HTTP_ERROR_MESSAGES[err.status];
    if (msg) return `❌ ${msg}`;

    if (err.error?.message) {
      return `❌ ${err.error.message}`;
    }

    return `⚠️ Unexpected error (${err.status})`;
  }

  // ------------------- Action -------------------
  recharge(): void {
    const mobile = this.mobile.trim();
    this.mobileError = this.validateMobile(mobile);

    if (this.mobileError || this.amount <= 0) {
      this.response = '❌ Please enter valid details.';
      this.cdr.markForCheck(); // 🔥 Trigger UI update
      return;
    }

    this.isLoading = true;
    this.response = '';

    const startTime = performance.now();

    this.rechargeService.recharge(mobile, this.amount)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.responseTime = this.formatDuration(performance.now() - startTime);
          this.cdr.markForCheck(); // 🔥 Trigger UI update
        })
      )
      .subscribe({
        next: (res) => {
          this.response = res?.message ?? '✅ Recharge successful';
          this.cdr.markForCheck(); // 🔥 Trigger UI update
        },
        error: (err) => {
          console.error('[HTTP ERROR]', err);

          this.response = this.handleHttpError(err) || '⚠️ Unknown error';
          this.isLoading = false;
          this.cdr.markForCheck(); // 🔥 Trigger UI update
        }
      });
  }
}