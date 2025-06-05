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
    { title: 'Legszebb autó', id: '66fe967fdc782b1e24ede2b8', isOpen: true, plate: '', error: '' },
    { title: 'Legmacsósabb autó', id: '66fe9694dc782b1e24ede2ba', isOpen: true, plate: '', error: '' },
    { title: 'Legcsajosabb autó', id: '66fe969bdc782b1e24ede2bc', isOpen: true, plate: '', error: '' }
  ];

  toggleOption(index: number) {
    this.options[index].isOpen = !this.options[index].isOpen;
  }

  // async submit(index: number) {

  //   const plate = this.options[index].plate;

  //   if (!/^\d{3}$/.test(plate)) {
  //     this.options[index].error = 'Kérlek, pontosan három számjegyet írj be!';
  //     return;
  //   }

  //   alert(`A beküldött rendszám az ${this.options[index].title} számára: ${this.options[index].plate}`);
  //   this.options[index].isOpen = false;
  //   this.options[index].error = '';
  //   const body = JSON.stringify({licence_plate: this.options[index].plate, category: this.options[index].id})
  //   fetch("https://hecarfest-backend2.onrender.com/api/voting/"+this.options[index].id, {method: "POST", body: body, headers: { 'Content-Type': 'application/json' }})
  // }
  async submit(index: number) {
  const plate = this.options[index].plate;

  if (!/^\d{3}$/.test(plate)) {
    this.options[index].error = 'Kérlek, pontosan három számjegyet írj be!';
    return;
  }

  this.options[index].error = '';  // Hibaüzenet törlése

  const body = JSON.stringify({
    licence_plate: plate,
    category: this.options[index].id
  });

  try {
    const response = await fetch(
      `https://hecarfest-backend2.onrender.com/api/voting/${this.options[index].id}`,
      {
        method: "POST",
        body: body,
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      // 404 => feltehetően "már szavazott"
      if (response.status === 404) {
        this.options[index].error = 'Már szavaztál ebben a kategóriában!';
      } else {
        this.options[index].error = errorData.message || 'Hiba történt a beküldés során.';
      }
      return;
    }

    alert(`A beküldött rendszám az ${this.options[index].title} számára: ${plate}`);
    this.options[index].isOpen = false;
  } catch (error: any) {
    console.error(error);
    this.options[index].error = 'Hálózati hiba vagy szerverhiba történt.';
  }
}


  onInput(option: any) {
    // Csak számjegyeket enged beírni, max 3 karakter
    option.plate = option.plate.replace(/\D/g, '').slice(0, 3);
    // Hibaüzenet eltüntetése, amint újra ír
    option.error = '';
  }

}
