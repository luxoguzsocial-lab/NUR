import { Platform } from 'react-native';

/** Uygulama icindeki ilerleme degisince ekli Android widget'larini hemen yeniler. */
export function syncAndroidWidgets(): void {
  if (Platform.OS !== 'android') return;
  void Promise.all(
    ['NurVakit', 'NurBugun'].map(async (widgetName) => {
      const [{ requestWidgetUpdate }, { renderWidgetForName }] = await Promise.all([
        import('react-native-android-widget'),
        import('./widget-task-handler'),
      ]);
      await requestWidgetUpdate({
        widgetName,
        renderWidget: () => renderWidgetForName(widgetName),
      });
    }),
  );
}

