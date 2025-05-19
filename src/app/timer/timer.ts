import { Component, OnDestroy, OnInit } from '@angular/core';
import { Howl } from 'howler';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.html',
  styleUrls: ['./timer.css'],
})
export class Timer implements OnInit, OnDestroy {
  timeLeft: number = 20 * 60;
  timerDisplay: string = '20:00';
  isRunning: boolean = false;
  private worker: Worker | null = null;
  private sound: Howl;

  constructor() {
    // Initialize Howler.js sound
    this.sound = new Howl({
      src: ['/sounds/notification.mp3'], // Keep your path
      volume: 0.5,
    });
  }

  ngOnInit() {
    this.requestNotificationPermission();
    // Initialize Web Worker
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./timer.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        if (data === 'done') {
          this.showBreakNotification();
          this.resetTimer();
        } else {
          this.timeLeft = data.timeLeft;
          this.updateTimerDisplay();
        }
      };
    } else {
      console.error('Web Workers are not supported in this environment.');
    }
  }

  ngOnDestroy() {
    if (this.worker) {
      this.worker.terminate();
    }
  }

  public startTimer(): void {
    if (!this.isRunning && this.worker) {
      this.isRunning = true;
      this.worker.postMessage({ command: 'start', duration: this.timeLeft });
    }
  }

  public resetTimer(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = new Worker(new URL('./timer.worker', import.meta.url));
      this.worker.onmessage = ({ data }) => {
        if (data === 'done') {
          this.showBreakNotification();
          this.resetTimer();
        } else {
          this.timeLeft = data.timeLeft;
          this.updateTimerDisplay();
        }
      };
    }
    this.timeLeft = 20 * 60;
    this.updateTimerDisplay();
    this.isRunning = false;
  }

  private updateTimerDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  private requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications.');
      return;
    }
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  }

  private showBreakNotification() {
    if (Notification.permission === 'granted') {
      new Notification('20-20-20 Break Time!', {
        body: 'Take a 20-second break and look 20 feet away.',
        icon: '/favicon.ico', // Keep your path
        requireInteraction: true,
      });
    } else {
      alert('Time for a 20-second break! Look 20 feet away.');
    }
    // Play sound with Howler.js
    this.sound.play();
  }
}
