import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})

export class SidebarComponent {
  submenuOpen = false;
  toggleSubmenu() {
    this.submenuOpen = !this.submenuOpen;
  }
}
