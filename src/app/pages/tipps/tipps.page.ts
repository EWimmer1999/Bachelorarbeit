import { Component, OnInit } from '@angular/core';
import { Tipp } from 'src/app/services/data.service';
import { TippsService} from 'src/app/services/tipps.service';
import { UpdateService } from 'src/app/services/update.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipps',
  templateUrl: './tipps.page.html',
  styleUrls: ['./tipps.page.scss'],
})
export class TippsPage implements OnInit {

  tipps: Tipp[] = [];

  constructor(private tippsService: TippsService, private router: Router, private updateService: UpdateService) { }

  async ngOnInit() {

    await this.updateService.getTipps();
    this.tipps = await this.tippsService.loadTipps();
    console.log('Loaded tipps:', this.tipps)
  }

  viewTippDetail(tippId: number) {
    this.router.navigate([`/tipp/${tippId}`]);
  }
}
