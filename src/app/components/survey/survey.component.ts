import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Survey} from 'src/app/services/data.service';

@Component({
  selector: 'survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyComponent {
  private platform = inject(Platform);
  @Input() survey?: Survey;
  isIos() {
    return this.platform.is('ios')
  }
}
