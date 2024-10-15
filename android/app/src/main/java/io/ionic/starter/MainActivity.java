package io.ionic.starter;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin; // Importiere Plugin, um die Annotation zu verwenden
import io.capacitor.plugin.stepcounter.StepCounterPlugin; // Importiere dein Plugin

import java.util.ArrayList;


public class MainActivity extends BridgeActivity {

  @Override
  public void onCreate(Bundle savedInstanceState) {
    
    registerPlugin(StepCounterPlugin.class);
    super.onCreate(savedInstanceState);
  }
}
