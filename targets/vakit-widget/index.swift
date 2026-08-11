import WidgetKit
import SwiftUI

// Uygulama ile paylaşılan App Group; RN tarafı nur-widget-bridge modülüyle yazar.
private let appGroup = "group.com.nurapp.mobile"
private let dataKey = "nur.widget.data"

// MARK: - Veri modeli (JS tarafındaki ios-widget-data.ts ile birebir aynı şema)

struct PrayerItem: Codable, Identifiable {
    let key: String      // fajr | sunrise | dhuhr | asr | maghrib | isha
    let label: String    // İmsak, Güneş, ...
    let epoch: Double    // saniye (Unix)

    var id: Double { epoch }
    var date: Date { Date(timeIntervalSince1970: epoch) }
}

struct JourneySummary: Codable {
    let completed: Int
    let total: Int
    let weekCompleted: Int
    let weekGoal: Int
    let nextAction: String
}

struct WidgetPayload: Codable {
    let city: String
    let hijri: String
    let prayers: [PrayerItem] // bugün + yarın, zamana göre sıralı (12 kayıt)
    let journey: JourneySummary?
}

func loadPayload() -> WidgetPayload? {
    guard
        let raw = UserDefaults(suiteName: appGroup)?.string(forKey: dataKey),
        let data = raw.data(using: .utf8)
    else { return nil }
    return try? JSONDecoder().decode(WidgetPayload.self, from: data)
}

// MARK: - Timeline

struct VakitEntry: TimelineEntry {
    let date: Date
    let payload: WidgetPayload?
}

struct VakitProvider: TimelineProvider {
    func placeholder(in context: Context) -> VakitEntry {
        VakitEntry(date: Date(), payload: samplePayload)
    }

    func getSnapshot(in context: Context, completion: @escaping (VakitEntry) -> Void) {
        completion(VakitEntry(date: Date(), payload: loadPayload() ?? samplePayload))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<VakitEntry>) -> Void) {
        let now = Date()
        let payload = loadPayload()
        // Her vakit sınırında yeni giriş: "sıradaki vakit" ve gece/gündüz teması
        // tam vaktinde değişir (güneş ve akşam da sınır olduğundan tema geçişi dahil).
        var dates: [Date] = [now]
        if let p = payload {
            dates += p.prayers.map(\.date).filter { $0 > now }
        }
        let entries = dates.map { VakitEntry(date: $0, payload: payload) }
        completion(Timeline(entries: entries, policy: .atEnd))
    }
}

// MARK: - Yardımcılar

extension WidgetPayload {
    /// Geri sayım hedefi: entry anından sonraki ilk vakit (Güneş namaz sayılmadığı için atlanır).
    func nextPrayer(after date: Date) -> PrayerItem? {
        prayers.first { $0.key != "sunrise" && $0.date > date }
    }

    /// İlerleme çubuğunun başlangıcı: sıradaki vakitten önceki son vakit.
    func previousPrayer(before next: PrayerItem, at date: Date) -> Date {
        let prev = prayers
            .filter { $0.key != "sunrise" && $0.date <= date }
            .map(\.date)
            .max()
        // Gece yarısı → imsak arasında elde veri yoksa 4 saatlik pencere varsay.
        return prev ?? next.date.addingTimeInterval(-4 * 3600)
    }

    /// Alt satır: sıradaki vaktin gününe ait 6 vakit.
    func rows(for next: PrayerItem) -> [PrayerItem] {
        let cal = Calendar.current
        return prayers.filter { cal.isDate($0.date, inSameDayAs: next.date) }
    }

    /// Gece penceresi (Akşam→Güneş): uygulamadaki vakit temelli temayla aynı kural.
    func isNight(at date: Date) -> Bool {
        let cal = Calendar.current
        let sameDay = prayers.filter { cal.isDate($0.date, inSameDayAs: date) }
        guard
            let maghrib = sameDay.first(where: { $0.key == "maghrib" })?.date,
            let sunrise = sameDay.first(where: { $0.key == "sunrise" })?.date
        else { return false }
        return date >= maghrib || date < sunrise
    }
}

private func timeString(_ date: Date) -> String {
    let f = DateFormatter()
    f.dateFormat = "HH:mm"
    return f.string(from: date)
}

// MARK: - Tema (uygulamadaki lacivert+altın paletle aynı)

struct VakitPalette {
    let gradientTop: Color
    let gradientBottom: Color
    let header: Color
    let title: Color
    let remaining: Color
    let time: Color
    let progress: Color
    let rowLabel: Color
    let rowTime: Color
    let nextChip: Color
    let nextLabel: Color
    let nextTime: Color
    let symbol: String

    static let night = VakitPalette(
        gradientTop: Color(red: 0.106, green: 0.141, blue: 0.251),    // #1B2440
        gradientBottom: Color(red: 0.043, green: 0.067, blue: 0.125), // #0B1120
        header: Color(red: 0.580, green: 0.639, blue: 0.722),         // #94A3B8
        title: .white,
        remaining: Color(red: 0.714, green: 0.761, blue: 0.839),      // #B6C2D6
        time: Color(red: 0.831, green: 0.686, blue: 0.216),           // #D4AF37
        progress: Color(red: 0.831, green: 0.686, blue: 0.216),
        rowLabel: Color(red: 0.486, green: 0.541, blue: 0.647),       // #7C8AA5
        rowTime: Color(red: 0.780, green: 0.824, blue: 0.894),        // #C7D2E4
        nextChip: Color.white.opacity(0.13),
        nextLabel: Color(red: 0.945, green: 0.894, blue: 0.722),      // #F1E4B8
        nextTime: .white,
        symbol: "☾"
    )

    static let day = VakitPalette(
        gradientTop: .white,
        gradientBottom: Color(red: 0.937, green: 0.929, blue: 0.902), // #EFEDE6
        header: Color(red: 0.420, green: 0.416, blue: 0.392),         // #6B6A64
        title: Color(red: 0.110, green: 0.106, blue: 0.094),          // #1C1B18
        remaining: Color(red: 0.420, green: 0.416, blue: 0.392),
        time: Color(red: 0.055, green: 0.451, blue: 0.396),           // #0E7365
        progress: Color(red: 0.055, green: 0.451, blue: 0.396),
        rowLabel: Color(red: 0.545, green: 0.541, blue: 0.510),       // #8B8A82
        rowTime: Color(red: 0.235, green: 0.231, blue: 0.212),        // #3C3B36
        nextChip: Color(red: 0.055, green: 0.451, blue: 0.396).opacity(0.10),
        nextLabel: Color(red: 0.039, green: 0.357, blue: 0.314),      // #0A5B50
        nextTime: Color(red: 0.055, green: 0.451, blue: 0.396),
        symbol: "☀"
    )
}

// MARK: - Görünüm (Android 4×2 paneliyle aynı tasarım)

struct VakitWidgetView: View {
    var entry: VakitEntry
    @Environment(\.widgetFamily) private var family

    private var palette: VakitPalette {
        (entry.payload?.isNight(at: entry.date) ?? true) ? .night : .day
    }

    var body: some View {
        Group {
            if let payload = entry.payload, let next = payload.nextPrayer(after: entry.date) {
                familyContent(payload: payload, next: next)
            } else {
                VStack(spacing: 6) {
                    Text("NUR")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(palette.title)
                    Text("Vakitler için uygulamayı bir kez açın")
                        .font(.system(size: 12))
                        .foregroundStyle(palette.remaining)
                        .multilineTextAlignment(.center)
                }
            }
        }
        .containerBackground(for: .widget) {
            if family == .systemMedium {
                LinearGradient(
                    colors: [palette.gradientTop, palette.gradientBottom],
                    startPoint: .top,
                    endPoint: .bottom
                )
            } else {
                Color.clear
            }
        }
        .widgetURL(URL(string: "nur://"))
    }

    @ViewBuilder
    private func familyContent(payload: WidgetPayload, next: PrayerItem) -> some View {
        switch family {
        case .accessoryInline:
            inlineContent(payload: payload, next: next)
        case .accessoryCircular:
            circularContent(payload: payload, next: next)
        case .accessoryRectangular:
            rectangularContent(payload: payload, next: next)
        default:
            content(payload: payload, next: next)
        }
    }

    private func inlineContent(payload: WidgetPayload, next: PrayerItem) -> some View {
        let journeyText = payload.journey.map { " · Bugün \($0.completed)/\($0.total)" } ?? ""
        return Text("\(next.label) \(timeString(next.date))\(journeyText)")
    }

    private func circularContent(payload: WidgetPayload, next: PrayerItem) -> some View {
        let completed = Double(payload.journey?.completed ?? 0)
        let total = Double(max(1, payload.journey?.total ?? 3))
        return Gauge(value: completed, in: 0...total) {
            Text("NUR")
        } currentValueLabel: {
            VStack(spacing: 0) {
                Text(String(next.label.prefix(2)))
                    .font(.system(size: 10, weight: .semibold))
                Text(timeString(next.date))
                    .font(.system(size: 12, weight: .bold))
                    .monospacedDigit()
            }
        }
        .gaugeStyle(.accessoryCircularCapacity)
        .widgetAccentable()
    }

    private func rectangularContent(payload: WidgetPayload, next: PrayerItem) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            HStack {
                Text(next.label)
                    .font(.headline)
                Spacer()
                Text(timeString(next.date))
                    .font(.headline)
                    .monospacedDigit()
            }
            Text(timerInterval: entry.date...next.date, countsDown: true)
                .font(.caption)
                .monospacedDigit()
            if let journey = payload.journey {
                HStack(spacing: 4) {
                    Text("Bugün \(journey.completed)/\(journey.total)")
                    Text("·")
                    Text("Hafta \(journey.weekCompleted)/\(journey.weekGoal)")
                }
                .font(.caption2)
                .foregroundStyle(.secondary)
            }
        }
        .widgetAccentable()
    }

    @ViewBuilder
    private func content(payload: WidgetPayload, next: PrayerItem) -> some View {
        let c = palette
        let prevDate = payload.previousPrayer(before: next, at: entry.date)
        VStack(alignment: .leading, spacing: 0) {
            // Üst satır: şehir + hicri tarih
            HStack {
                Text("\(c.symbol) \(payload.city.uppercased(with: Locale(identifier: "tr_TR")))")
                    .font(.system(size: 11))
                    .kerning(1)
                Spacer()
                Text(payload.hijri)
                    .font(.system(size: 11))
            }
            .foregroundStyle(c.header)

            // Orta: sıradaki vakit + canlı geri sayım + saat
            HStack(alignment: .center) {
                VStack(alignment: .leading, spacing: 2) {
                    Text(next.label)
                        .font(.system(size: 26, weight: .bold))
                        .foregroundStyle(c.title)
                    HStack(spacing: 4) {
                        Text(timerInterval: entry.date...next.date, countsDown: true)
                            .monospacedDigit()
                            .frame(maxWidth: 76, alignment: .leading)
                        Text("kaldı")
                    }
                    .font(.system(size: 12))
                    .foregroundStyle(c.remaining)
                }
                Spacer()
                Text(timeString(next.date))
                    .font(.system(size: 40, weight: .bold))
                    .foregroundStyle(c.time)
            }
            .padding(.top, 6)

            // İlerleme çubuğu: önceki vakitten sıradakine, canlı dolar
            ProgressView(timerInterval: prevDate...next.date, countsDown: false, label: { EmptyView() }, currentValueLabel: { EmptyView() })
                .progressViewStyle(.linear)
                .tint(c.progress)
                .padding(.top, 6)
                .padding(.bottom, 4)

            if let journey = payload.journey {
                HStack(spacing: 5) {
                    Text("Bugün \(journey.completed)/\(journey.total)")
                        .fontWeight(.semibold)
                    Text("·")
                    Text(journey.nextAction)
                        .lineLimit(1)
                    Spacer(minLength: 4)
                    Text("Hafta \(journey.weekCompleted)/\(journey.weekGoal)")
                }
                .font(.system(size: 9))
                .foregroundStyle(c.remaining)
                .padding(.bottom, 4)
            }

            // Alt satır: günün 6 vakti
            HStack(spacing: 0) {
                ForEach(payload.rows(for: next)) { item in
                    let isNext = item.epoch == next.epoch
                    VStack(spacing: 1) {
                        Text(item.label)
                            .font(.system(size: 10))
                            .foregroundStyle(isNext ? c.nextLabel : c.rowLabel)
                        Text(timeString(item.date))
                            .font(.system(size: 12, weight: isNext ? .bold : .regular))
                            .foregroundStyle(isNext ? c.nextTime : c.rowTime)
                    }
                    .padding(.horizontal, 6)
                    .padding(.vertical, 4)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(isNext ? c.nextChip : Color.clear)
                    )
                    if item.id != payload.rows(for: next).last?.id { Spacer(minLength: 0) }
                }
            }
        }
    }
}

// MARK: - Widget tanımı

struct VakitWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "NurVakitWidget", provider: VakitProvider()) { entry in
            VakitWidgetView(entry: entry)
        }
        .configurationDisplayName("NUR — Vakit")
        .description("Sıradaki namaz vakti, günlük yolculuk ve haftalık devamlılık.")
        .supportedFamilies([.systemMedium, .accessoryInline, .accessoryCircular, .accessoryRectangular])
    }
}

@main
struct NurWidgetBundle: WidgetBundle {
    var body: some Widget {
        VakitWidget()
    }
}

// MARK: - Önizleme verisi (galeri/placeholder)

private let samplePayload: WidgetPayload = {
    let cal = Calendar.current
    let base = cal.startOfDay(for: Date())
    func at(_ h: Int, _ m: Int, day: Int = 0) -> Double {
        cal.date(byAdding: DateComponents(day: day, hour: h, minute: m), to: base)!.timeIntervalSince1970
    }
    let labels: [(String, String, Int, Int)] = [
        ("fajr", "İmsak", 4, 20), ("sunrise", "Güneş", 6, 1), ("dhuhr", "Öğle", 13, 15),
        ("asr", "İkindi", 18, 10), ("maghrib", "Akşam", 20, 18), ("isha", "Yatsı", 21, 51),
    ]
    var prayers: [PrayerItem] = []
    for day in 0...1 {
        for (key, label, h, m) in labels {
            prayers.append(PrayerItem(key: key, label: label, epoch: at(h, m, day: day)))
        }
    }
    return WidgetPayload(
        city: "İstanbul",
        hijri: "24 Safer 1448",
        prayers: prayers,
        journey: JourneySummary(
            completed: 1,
            total: 3,
            weekCompleted: 2,
            weekGoal: 4,
            nextAction: "5 dk Kur'an oku"
        )
    )
}()
