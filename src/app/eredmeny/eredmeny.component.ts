import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, throwError, Observable, of, forkJoin } from 'rxjs';

interface VotingResult {
  _id: string;
  count: number;
}

interface Category {
  _id: string;
  name: string;
}

interface VoteDetails {
  _id: string;
  licence_plate: string;
  date: Date;
  category: string;
}

interface CarVotes {
  licence_plate: string;
  vote_count: number;
  last_vote_date: Date | null;
}

interface Result {
  category: Category;
  votes: VotingResult[];
  voteDetails: VoteDetails[];
  carVotes: CarVotes[];
  count: number;
}

@Component({
  selector: 'app-eredmeny',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eredmeny.component.html',
  styleUrl: './eredmeny.component.scss'
})
export class EredmenyComponent implements OnInit {
  votings: VotingResult[] = [];
  categories: Category[] = [];
  votes: VoteDetails[] = [];
  results: Result[] = [];
  error: string | null = null;
  votesWithCategories: any[] = [];  // Összekapcsolt szavazatok és kategóriák

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {
    // ForkJoin használata a párhuzamos kérések kezelésére
    forkJoin({
      // votings: this.http.get<VotingResult[]>('http://localhost:8000/api/votings').pipe(
        votings: this.http.get<VotingResult[]>('https://hecarfest-backend2.onrender.com/api/votings').pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Hiba történt:', error);
          return of([]);
        })
      ),
      votes: this.http.get<VoteDetails[]>('https://hecarfest-backend2.onrender.com/api/voting/details').pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Részletes szavazati adatok lekérési hiba:', error);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ votings, votes }) => {
        this.votings = votings;
        this.votes = votes;
        this.loadCategories();
      },
      error: (err) => {
        console.error('Hiba az adatok lekérésénél:', err);
        this.error = 'Hiba történt az adatok lekérésénél';
      }
    });
  }
  

  loadCategories(): void {
    this.http.get<{ data: Category[] }>('https://hecarfest-backend2.onrender.com/api/category')
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Kategóriák lekérési hiba:', error);
          this.initializeDefaultCategories(); // Alapértelmezett kategóriák használata hiba esetén
          return of({ data: this.categories });
        })
      )
      .subscribe({
        next: (response) => {
          if (response.data && response.data.length > 0) {
            this.categories = response.data;
          } else {
            console.warn('Figyelmeztetés: A kategória adatok üresek vagy nem megfelelő formátumban érkeztek');
            this.initializeDefaultCategories();
          }
          this.mapResults();
        },
        error: (err) => {
          console.error('Hiba a kategóriák lekérésekor:', err);
          this.initializeDefaultCategories();
          this.mapResults();
        }
      });
  }

  private initializeDefaultCategories(): void {
    const defaultCategories = [
      { _id: '66fe967fdc782b1e24ede2b8', name: 'Legszebb autó' },
      { _id: '66fe9694dc782b1e24ede2ba', name: 'Legmacsósabb autó' },
      { _id: '66fe969bdc782b1e24ede2bc', name: 'Legcsajosabb autó' }
    ];
    this.categories = defaultCategories;
    // this.mapResults();
  }

  mapResults(): void {
    console.log('Előző eredmények:', this.results);  // Előző eredmények logolása
    this.results = this.categories.map(category => ({
        category: category,
        votes: this.votings.filter(vote => String(vote._id) === String(category._id)),
        voteDetails: this.votes.filter(vote => vote.category === category._id),
        carVotes: this.calculateCarVotes(category._id),
        count: this.votings.filter(vote => String(vote._id) === String(category._id)).length
    }));
    console.log('Friss eredmények:', this.results);  // Friss eredmények logolása
}
  
  //   console.log('Friss eredmények:', this.results);  // Friss eredmények logolása
  // }

  private calculateCarVotes(categoryId: string): CarVotes[] {
    const categoryVotes = this.votes.filter(v => v.category === categoryId);
    
    const carVotesMap = new Map<string, { count: number; lastVoteDate: Date | null }>();
    
    categoryVotes.forEach(vote => {
      const currentVoteData = carVotesMap.get(vote.licence_plate) || { count: 0, lastVoteDate: null };
      carVotesMap.set(vote.licence_plate, {
        count: currentVoteData.count + 1,
        lastVoteDate: vote.date
      });
    });

    return Array.from(carVotesMap.entries())
      .map(([licence_plate, data]) => ({
        licence_plate,
        vote_count: data.count,
        last_vote_date: data.lastVoteDate
      }))
      .sort((a, b) => b.vote_count - a.vote_count || 
          (new Date(b.last_vote_date!).getTime() - new Date(a.last_vote_date!).getTime()));
  }

  // Frissített eredmények előállítása
  updateResults(): void {
    // Null check és típusbiztonság hozzáadása
    if (!this.votes || !this.categories) {
      console.warn('Hiányzó adatok a szavazatok frissítéséhez');
      return;
    }
  
    this.votesWithCategories = this.votes.map(vote => {
      const category = this.categories.find(cat => cat._id === vote.category);
      if (!category) {
        console.warn(`Nincs kategória a szavazathoz: ${vote.category}`);
        return {
          ...vote,
          category: { _id: '', name: 'Ismeretlen' }
        };
      }
      return {
        ...vote,
        category: category
      };
    });
  
    const resultsObject = this.votesWithCategories.reduce((acc: { [key: string]: Result }, vote) => {
      if (!vote.category || !vote.category._id) {
        console.warn(`Szavazat kategória azonosító nélkül: ${vote}`);
        return acc;
      }
      const categoryId = vote.category._id;
      if (!acc[categoryId]) {
        acc[categoryId] = {
          category: vote.category,
          votes: [],
          voteDetails: [],
          carVotes: [],
          count: 0
        };
      }
      acc[categoryId].count++;
      return acc;
    }, {});

  this.results = Object.values(this.results);
  console.log('Frissített eredmények:', this.results);


  }
  
  
}
