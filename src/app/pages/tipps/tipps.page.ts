import { Component, OnInit } from '@angular/core';
import { Tipp } from 'src/app/services/data.service';
import { TippsService } from 'src/app/services/tipps.service';
import { UpdateService } from 'src/app/services/update.service';
import { Router } from '@angular/router';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-tipps',
  templateUrl: './tipps.page.html',
  styleUrls: ['./tipps.page.scss'],
})
export class TippsPage implements OnInit{
  tipps: Tipp[] = [];

  constructor(
    private tippsService: TippsService, 
    private router: Router, 
    private updateService: UpdateService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.applyTheme();
  }
  async ionViewWillEnter(){
    this.tipps = await this.tippsService.loadTipps();
    console.log('Loaded tipps from storage:', this.tipps);
    
  }

  viewTippDetail(tippId: number) {
    this.router.navigate([`/tipp/${tippId}`]);
  }
}
