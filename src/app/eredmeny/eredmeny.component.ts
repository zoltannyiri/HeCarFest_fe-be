import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-eredmeny',
  templateUrl: './eredmeny.component.html',
  styleUrls: ['./eredmeny.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EredmenyComponent implements OnInit {
  categories: any[] = [];
  topVotes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>('http://localhost:8000/api/category').subscribe(
      response => {
        console.log('Categories response:', response);
        if (Array.isArray(response.data) && response.data.length > 0) {
          this.categories = response.data;
          this.http.get<any>('http://localhost:8000/api/votings').subscribe(
            votings => {
              console.log('Votings response:', votings);
              this.processVotingData(votings);
            },
            error => {
              console.error('Error fetching votings:', error);
            }
          );
        } else {
          console.error('Categories response data is not an array or is empty:', response.data);
        }
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  private processVotingData(votings: any[]) {
    this.categories.forEach(category => {
      const categoryVoting = votings.find(v => v._id === category._id);
      const categoryVotes = categoryVoting ? categoryVoting.votes : [];
      const totalVotes = categoryVotes.length;

      const plateGroups = categoryVotes.reduce((acc: any, curr: any) => {
        acc[curr.licence_plate] = (acc[curr.licence_plate] || 0) + 1;
        return acc;
      }, {});

      const topVote = Object.entries(plateGroups)
        .map(([plate, count]) => ({
          plate,
          percentage: (Number(count) / totalVotes) * 100
        }))
        .sort((a, b) => b.percentage - a.percentage)[0];

      this.topVotes.push({
        category: category.name,
        vote: topVote
      });
    });
  }
}