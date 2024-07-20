import { Injectable } from "@nestjs/common";

@Injectable()
export class DateShorterService {
  shoter(dateISO: Date): string {
    const date = new Date(dateISO);

    const annee = date.getFullYear();
    const mois = (date.getMonth() + 1).toString().padStart(2, "0");
    const jour = date.getDate().toString().padStart(2, "0");

    const dateCourte = `${annee}-${mois}-${jour}`;

    return dateCourte;
  }
}
