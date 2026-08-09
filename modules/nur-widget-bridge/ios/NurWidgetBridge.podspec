Pod::Spec.new do |s|
  s.name           = 'NurWidgetBridge'
  s.version        = '1.0.0'
  s.summary        = 'NUR iOS widget veri koprusu'
  s.description    = 'Namaz vakti verisini App Group uzerinden WidgetKit hedefine yazar.'
  s.author         = 'NUR'
  s.homepage       = 'https://example.invalid/nur'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = '**/*.{h,m,swift}'
end
