import ExpoModulesCore
import WidgetKit

/// Namaz vakti verisini App Group'a yazar ve widget zaman çizelgelerini tazeler.
/// App Group kimliği targets/vakit-widget/index.swift ile aynı olmalıdır.
public class NurWidgetBridgeModule: Module {
  private let appGroup = "group.com.nurapp.mobile"
  private let dataKey = "nur.widget.data"

  public func definition() -> ModuleDefinition {
    Name("NurWidgetBridge")

    Function("setWidgetData") { (json: String) in
      let defaults = UserDefaults(suiteName: self.appGroup)
      defaults?.set(json, forKey: self.dataKey)
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
