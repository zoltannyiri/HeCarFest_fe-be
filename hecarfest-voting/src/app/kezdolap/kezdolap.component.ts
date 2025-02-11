import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-kezdolap',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './kezdolap.component.html',
  styleUrl: './kezdolap.component.scss'
})
export class KezdolapComponent {
  options = [
    { title: 'Legszebb autó', id: '66fe967fdc782b1e24ede2b8', isOpen: true, plate: '' },
    { title: 'Legmacsósabb autó', id: '66fe9694dc782b1e24ede2ba', isOpen: true, plate: '' },
    { title: 'Legcsajosabb autó', id: '66fe969bdc782b1e24ede2bc', isOpen: true, plate: '' }
  ];

  toggleOption(index: number) {
    this.options[index].isOpen = !this.options[index].isOpen;
  }

  submit(index: number) {
    alert(`A beküldött rendszám az ${this.options[index].title} számára: ${this.options[index].plate}`);
    this.options[index].isOpen = false;
    const body = JSON.stringify({licence_plate: this.options[index].plate, category: this.options[index].id})
    fetch("http://localhost:8000/api/voting/"+this.options[index].id, {method: "POST", body: body, headers: { 'Content-Type': 'application/json' }})
  }
}
