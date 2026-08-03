/**
 * Seçme hadisler — yalnızca Kütüb-i Sitte'nin en sahih kaynaklarından,
 * yaygın olarak bilinen rivayetler. Her kayıtta kaynak ve sıhhat bilgisi.
 */

export interface HadithItem {
  id: string;
  textTr: string;
  source: string;
  grading: 'Sahih';
  topic: string;
}

export const HADITHS: HadithItem[] = [
  { id: 'h1', textTr: 'Ameller niyetlere göredir; herkese ancak niyet ettiği vardır.', source: 'Buhârî, Bed\'ü\'l-vahy 1; Müslim, İmâre 155', grading: 'Sahih', topic: 'Niyet' },
  { id: 'h2', textTr: 'Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.', source: 'Buhârî, Îmân 7; Müslim, Îmân 71', grading: 'Sahih', topic: 'Kardeşlik' },
  { id: 'h3', textTr: 'Müslüman, elinden ve dilinden Müslümanların güvende olduğu kimsedir.', source: 'Buhârî, Îmân 4; Müslim, Îmân 64', grading: 'Sahih', topic: 'Ahlak' },
  { id: 'h4', textTr: 'Allah\'a ve ahiret gününe iman eden, ya hayır söylesin ya da sussun.', source: 'Buhârî, Edeb 31; Müslim, Îmân 74', grading: 'Sahih', topic: 'Dil' },
  { id: 'h5', textTr: 'Kolaylaştırınız, zorlaştırmayınız; müjdeleyiniz, nefret ettirmeyiniz.', source: 'Buhârî, İlim 11; Müslim, Cihâd 6', grading: 'Sahih', topic: 'Davet' },
  { id: 'h6', textTr: 'İnsanlara merhamet etmeyene Allah da merhamet etmez.', source: 'Buhârî, Edeb 27; Müslim, Fezâil 66', grading: 'Sahih', topic: 'Merhamet' },
  { id: 'h7', textTr: 'Güçlü kimse, insanları güreşte yenen değil; öfke anında kendine hâkim olandır.', source: 'Buhârî, Edeb 76; Müslim, Birr 107', grading: 'Sahih', topic: 'Öfke' },
  { id: 'h8', textTr: 'Din nasihattir (samimiyettir).', source: 'Müslim, Îmân 95', grading: 'Sahih', topic: 'Samimiyet' },
  { id: 'h9', textTr: 'Temizlik imanın yarısıdır.', source: 'Müslim, Tahâret 1', grading: 'Sahih', topic: 'Temizlik' },
  { id: 'h10', textTr: 'Kim Allah\'a ve ahiret gününe inanıyorsa komşusuna ikram etsin.', source: 'Buhârî, Edeb 31; Müslim, Îmân 74', grading: 'Sahih', topic: 'Komşuluk' },
  { id: 'h11', textTr: 'Sizin en hayırlınız, Kur\'an\'ı öğrenen ve öğretendir.', source: 'Buhârî, Fezâilü\'l-Kur\'ân 21', grading: 'Sahih', topic: 'Kur\'an' },
  { id: 'h12', textTr: 'Cennet annelerin ayakları altındadır — anneye iyilik, cennete götüren yoldandır.', source: 'Nesâî, Cihâd 6 (benzer lafızla)', grading: 'Sahih', topic: 'Anne-baba' },
  { id: 'h13', textTr: 'Küçüğümüze merhamet etmeyen, büyüğümüze saygı göstermeyen bizden değildir.', source: 'Tirmizî, Birr 15', grading: 'Sahih', topic: 'Saygı' },
  { id: 'h14', textTr: 'Mümin, bir delikten iki defa ısırılmaz (aynı hataya iki kez düşmez).', source: 'Buhârî, Edeb 83; Müslim, Zühd 63', grading: 'Sahih', topic: 'Basiret' },
  { id: 'h15', textTr: 'Veren el, alan elden üstündür.', source: 'Buhârî, Zekât 18; Müslim, Zekât 94', grading: 'Sahih', topic: 'İnfak' },
  { id: 'h16', textTr: 'Yarım hurma ile de olsa ateşten korunun; onu da bulamazsanız güzel bir sözle.', source: 'Buhârî, Zekât 10; Müslim, Zekât 66', grading: 'Sahih', topic: 'Sadaka' },
  { id: 'h17', textTr: 'Kardeşine tebessüm etmen sadakadır.', source: 'Tirmizî, Birr 36', grading: 'Sahih', topic: 'Tebessüm' },
  { id: 'h18', textTr: 'Allah katında amellerin en sevimlisi, az da olsa devamlı olanıdır.', source: 'Buhârî, Rikāk 18; Müslim, Müsâfirîn 218', grading: 'Sahih', topic: 'Devamlılık' },
  { id: 'h19', textTr: 'Kim bir hayra vesile olursa, onu yapan kadar sevap kazanır.', source: 'Müslim, İmâre 133', grading: 'Sahih', topic: 'Hayra vesile' },
  { id: 'h20', textTr: 'Hiçbiriniz, kendisi için istediğini mümin kardeşi için istemedikçe kâmil mümin olamaz; birbirinizi sevmedikçe cennete giremezsiniz. Size, yaptığınızda birbirinizi seveceğiniz bir şey söyleyeyim mi? Aranızda selamı yayınız.', source: 'Müslim, Îmân 93', grading: 'Sahih', topic: 'Selam' },
];
