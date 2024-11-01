import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';
import { TippsService } from 'src/app/services/tipps.service';

@Component({
  selector: 'app-tipp-detail',
  templateUrl: './tipp-detail.page.html',
  styleUrls: ['./tipp-detail.page.scss'],
})
export class TippDetailPage implements OnInit {
  tipp: any;

  constructor(
    private route: ActivatedRoute,
    private tippsService: TippsService,
    private router: Router,
    private themeService: ThemeService
  ) { }

  async ngOnInit() {

    const tippId = +this.route.snapshot.paramMap.get('id')!;
    this.tipp = (await this.tippsService.loadTipps()).find(s => s.id === tippId) || null;
    this.themeService.applyTheme();
  }

  returnOverview(){
    this.router.navigate(['tipps']);

  }
}
