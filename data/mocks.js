// Deneme sınavları (revizyon kâğıdı formatında), çalışma planı ve son tekrar kartları
window.MOCK_EXTRA = [
// ---- Revision U1 extras
{id:'r1-1b',u:1,topic:'Topic sentence',t:'write',mode:'ts',q:'Revision 1b: Write a topic sentence.',info:'Using a bicycle on campus → It saves time between buildings. | It is inexpensive. | It gives students some daily exercise.',model:['Using a bicycle on campus has several advantages for students.'],check:['Tam cümle','Topic: using a bicycle on campus','Controlling idea: advantages / benefits']},
{id:'r1-4bc',u:1,topic:'Reference words',t:'write',mode:'free',q:'Revision 4b–c: In sentence 7 "They can take them to the study area while they work." What do "They" and "them" refer to?',info:'(6) Finally, students can buy drinks from the café downstairs. (7) They can take them to the study area while they work.',model:['They → students\nthem → drinks'],check:['They = students','them = drinks']},
{id:'r1-plan',u:1,topic:'Planning',t:'write',mode:'free',q:'Revision 5: Plan "A Good Place to Relax on Campus" (short notes).',info:'Topic sentence | Major 1 + Minor 1 | Major 2 + Minor 2 | Major 3 + Minor 3 | Conclusion',model:['TS: campus garden — comfortable + convenient place to relax between classes\nMajor 1: trees and grass → Minor 1: sit under the trees (shade)\nMajor 2: benches + quiet corners → Minor 2: read or talk with friends\nMajor 3: close to the cafeteria → Minor 3: buy a drink nearby, rest between classes\nConclusion: perfect spot to take a break\n✗ football (left out: weakens unity)'],check:['Kısa notlar (tam cümle şart değil)','3 major + 3 minor','Futbol çıkarıldı','Conclusion notu var']},

// ---- Mock B U1
{id:'b1-1',u:1,topic:'Topic sentence',t:'write',mode:'ts',q:'Part 1: Write a topic sentence.',info:'Eating in the university cafeteria → The meals are cheap. | There is a healthy daily menu. | It is close to the classrooms.',model:['Eating in the university cafeteria has several advantages for students.'],check:['Tam cümle','Topic + controlling idea (advantages)']},
{id:'b1-2',u:1,topic:'Topic sentence',t:'write',mode:'ts',q:'Part 1: Write a topic sentence.',info:'Living in a dormitory → Students make new friends easily. | The rent is lower than a flat. | Everything is included: Wi-Fi, heating and cleaning.',model:['Living in a dormitory offers university students several benefits.'],check:['Tam cümle','Topic + controlling idea']},
{id:'b1-3',u:1,topic:'Major & minor',t:'match',q:'Part 2: TS: Learning to cook can help university students in several ways. Match major and minor.',left:['Cooking at home saves money.','Home-cooked meals are healthier.','Cooking can be a social activity.'],right:['Students can invite their friends and prepare dinner together.','A simple pasta meal at home costs much less than a restaurant meal.','Students can choose fresh vegetables and use less oil and salt.'],a:[1,2,0],ex:'1-b, 2-c, 3-a'},
{id:'b1-4',u:1,topic:'Major & minor',t:'write',mode:'minor',q:'Part 2: Add ONE minor detail.',info:'Major: Joining a sports club helps students stay fit.',model:['For example, members train together three times a week in the sports centre.'],check:['Major\'ı açıklıyor','Örnek/fact','Tam cümle']},
{id:'b1-5',u:1,topic:'Paragraph unity',t:'mc',q:'Part 3: (1) The university library is an excellent place to prepare for exams. (2) First, it has silent study rooms on every floor. (3) Students can concentrate there without any noise. (4) In addition, it stays open until midnight during the exam period. (5) The library building was designed by a famous architect in 1998. (6) Finally, students can borrow books and use computers for free. (7) For these reasons, many students choose the library during exam weeks. — Irrelevant sentence?',opts:['3','4','5','6'],a:2,ex:'Binanın tarihi/mimarı sınava hazırlıkla ilgili değil.'},
{id:'b1-6',u:1,topic:'Reference words',t:'mc',q:'Same paragraph: In sentence 3, "there" refers to…',opts:['every floor','the silent study rooms','exams','the students'],a:1,ex:'there = in the silent study rooms.'},
{id:'b1-7',u:1,topic:'Concluding sentence',t:'mc',q:'Part 4: TS: Walking to campus has several benefits for students. Best concluding sentence?',opts:['Walking to campus has several benefits for students.','In short, walking to university is a healthy and cheap way to start the day.','Also, some students drive expensive cars.','In conclusion, buses leave every ten minutes.'],a:1,ex:'Farklı kelimelerle tekrar ediyor ve yeni bilgi vermiyor.'},
{id:'b1-8',u:1,topic:'Paragraph writing',t:'write',mode:'para-idea',q:'Part 5: Write "A Good Place to Study on Campus" (7–9 sentences, ONE paragraph). Leave out the idea that does not support the central idea.',info:'Place: the university library | Ideas: silent study rooms; open until midnight in exam weeks; free computers and printers; thousands of books; <i>the building was opened in 1998</i> | Facts: concentrate without noise; study late before exams; print assignments; find sources for projects | Central idea: a quiet and useful place to study',model:['The university library is a quiet and useful place to study on campus. First, it has silent study rooms on every floor. Students can concentrate there without any noise. In addition, the library stays open until midnight during exam weeks. For example, students can study late before an important exam. Finally, it offers free computers, printers and thousands of books. Students can print their assignments and find sources for their projects there. For these reasons, the library is the best place on campus for serious studying.'],check:['TS: topic + controlling idea','3 major + minor','1998 bilgisi KULLANILMADI','Signalling words','Reference words','Concluding sentence (kopya değil, yeni fikir yok)','7–9 cümle, tek paragraf','Yazım/noktalama']},

// ---- Mock B U2
{id:'b2-1',u:2,topic:'Imperatives',t:'write',mode:'imp',q:'Part 1: Turn the notes into imperatives.',info:'you should take your student card with you | you must not eat in the computer lab | you should save your work every ten minutes | you need to log out before you leave',model:['Take your student card with you. Do not eat in the computer lab. Save your work every ten minutes. Log out before you leave.'],check:['"you should/must/need to" yok','Base verb','Do not + V1']},
{id:'b2-2',u:2,topic:'Sequence',t:'order',q:'Part 2: How to borrow a book from the library — put in order.',items:['Search for the book in the online catalogue.','Write down the call number of the book.','Find the book on the correct shelf.','Take the book to the self-service machine and scan your student card.','Scan the book and take your receipt.'],ex:'Search → write number → find → scan card → scan book.'},
{id:'b2-3',u:2,topic:'Warnings',t:'mc',q:'Part 2: Situation: Some students forget to return books on time and pay a fine. Best warning?',opts:['Then, scan the book.','Remember to check the return date on your receipt.','Books are useful.','You can find many books.'],a:1,ex:'Problemi (gecikme cezası) önlüyor.'},
{id:'b2-4',u:2,topic:'Sequence',t:'gap',q:'Part 2: Add sequence words.',text:'You can register for a sports course online in a few simple steps. {0}, open the Sports Centre page and log in. {1}, choose a course from the list. {2}, check the days and times of the course. {3}, click "Register" and pay the fee. {4}, wait for the confirmation email.',bank:['First','Next','Then','After that','Finally','In conclusion'],a:['First','Next','Then','After that','Finally'],ex:'In conclusion talimat paragrafında adım için kullanılmaz.'},
{id:'b2-5',u:2,topic:'Paragraph writing',t:'write',mode:'parts-instr',q:'Part 3: Write each part (Using the dorm laundry).',info:'a. TS — use the self-service laundry in the dorm | a few simple steps<br>b. First step + detail — put your clothes in the machine | no more than 7 kg<br>c. Middle step + warning — add detergent | check your pockets before you start<br>d. Final step — choose 30° or 40°, pay with your student card, press Start<br>e. Conclusion — clothes clean in about an hour',model:['a. You can use the self-service laundry in the dorm in a few simple steps.\nb. First, put your clothes in the washing machine, but do not put in more than 7 kg.\nc. Next, add one cup of detergent. Make sure you check your pockets before you start.\nd. Finally, choose 30° or 40°, pay with your student card and press "Start".\ne. In about an hour, your clothes will be clean and ready.'],check:['a: task + steps','b: First + imperative + detail','c: warning/check','d: Finally','e: result, yeni adım yok']},
{id:'b2-6',u:2,topic:'Paragraph writing',t:'write',mode:'para-instr',q:'Part 5: Write instructions: "How to use the self-service laundry in the dorm" (7–9 sentences, ONE paragraph).',info:'Steps: 1 Put your clothes in the machine (max 7 kg) → 2 Add detergent (one cup) → 3 Choose the program (30° / 40°) → 4 Pay with your student card → 5 Press Start. | Possible problems: coins/tissues in pockets; too many clothes; dark and white clothes together.',model:['Using the self-service laundry in the dorm is easy if you follow a few simple steps. First, check your pockets and take out any coins or tissues. Next, put your clothes in the machine, but do not put in more than 7 kg. Then, add one cup of detergent into the small box at the top. After that, choose the program, such as 30° for coloured clothes or 40° for white clothes. Be careful not to wash dark and white clothes together. Finally, pay with your student card and press the "Start" button. In about an hour, your clothes will be clean and fresh.'],check:['TS','Imperatives','Sequence words','Useful details (how much / which)','Warning','Result (yeni adım yok)','7–9 cümle, tek paragraf','Yazım/noktalama']},

// ---- Mock B U3
{id:'b3-1',u:3,topic:'Orientation',t:'write',mode:'orient',q:'Part 1: Write an orientation sentence.',info:'Who: my sister and I | When: last summer | Where: a small village near Antalya | What: a camping trip in the rain',model:['Last summer, my sister and I went on a camping trip in the rain in a small village near Antalya.'],check:['When','Who','What','Where','Past simple']},
{id:'b3-2',u:3,topic:'Orientation',t:'write',mode:'orient',q:'Part 1: Write an orientation sentence.',info:'Who: I | When: on my first day at university | Where: the campus cafeteria | What: dropping my tray in front of everyone',model:['On my first day at university, I dropped my tray in front of everyone in the campus cafeteria.'],check:['When','Who','What (dropped)','Where']},
{id:'b3-3',u:3,topic:'Time markers',t:'order',q:'Part 2: Put the events in order.',items:['I woke up early and prepared my presentation slides.','On the bus, I realised I had left my laptop at home.','I called my roommate and asked her to bring it.','A few minutes before class, she arrived with my laptop.','In the end, I gave my presentation on time.'],ex:'woke → realised → called → arrived → gave.'},
{id:'b3-4',u:3,topic:'Past simple',t:'write',mode:'past',q:'Part 2: Rewrite the notes in the past simple.',info:'we / take / the wrong train | I / not notice / the sign | the journey / be / very long | we / arrive / two hours late',model:['We took the wrong train. I did not notice the sign. The journey was very long. We arrived two hours late.'],check:['took','did not notice','was','arrived']},
{id:'b3-5',u:3,topic:'Show, don\'t tell',t:'write',mode:'show',q:'Part 2: Show the feeling with a detail.',info:'Telling: I was scared during the storm.',model:['My hands were shaking, and I jumped every time the thunder roared.'],check:['Duygu kelimesi yerine detay','Past']},
{id:'b3-6',u:3,topic:'Reorientation',t:'mc',q:'Part 2: Which is the best reorientation for "I dropped my tray in front of everyone"?',opts:['Then I ate my lunch.','Looking back, it was embarrassing, but now I laugh about it with my friends.','After that, I went to class.','The cafeteria was big.'],a:1,ex:'Yorum + duygu, yeni olay yok.'},
{id:'b3-7',u:3,topic:'Paragraph writing',t:'write',mode:'para-recount',q:'Part 5: Write a recount: "A Day When Everything Went Wrong" (6–8 sentences, ONE paragraph).',info:'Who: I | When: last Thursday | Where: on campus | E1: alarm did not ring — woke up late | E2: forgot my student card — could not enter the building | E3: started to rain — no umbrella | E4: a classmate shared her umbrella and her notes | Feeling: stressed → thankful | Ending: lesson — prepare my bag the night before',model:['Last Thursday, I had a day when everything went wrong on campus. First, my alarm did not ring, so I woke up late and missed breakfast. Then, I arrived at the faculty building, but I could not enter because I had forgotten my student card. My heart was beating fast, and I kept checking my bag again and again. A few minutes later, it suddenly started to rain, and I did not have an umbrella. Finally, a classmate shared her umbrella with me and later gave me her lecture notes. Looking back, it was a stressful day, but I learned to prepare my bag the night before.'],check:['Orientation','Time markers','Doğru sıra','Past simple','Showing detail','Reorientation (ders), yeni olay yok','6–8 cümle, tek paragraf','Yazım/noktalama']}
];

window.MOCKS = [
{id:'rev1',u:1,title:'Revision 1 · From Sentences to Paragraphs',sub:'Hocanın gerçek revizyon kâğıdı (çözümlü)',parts:[
 {t:'1. Clear topic sentence',ids:['u1-ts11','r1-1b','u1-ts12']},
 {t:'2. Major & minor details',ids:['u1-m5','u1-m6']},
 {t:'3. Paragraph organisation part by part',ids:['u1-w1']},
 {t:'4. Reference words & unity',ids:['u1-un4','u1-r5','r1-4bc']},
 {t:'5. Plan your paragraph',ids:['u1-un5','r1-plan']},
 {t:'6. Write & revise',ids:['u1-w2']}]},
{id:'rev2',u:2,title:'Revision 2 · Writing Instructions',sub:'Hocanın gerçek revizyon kâğıdı (çözümlü)',parts:[
 {t:'1. Clear instructions',ids:['u2-im1','u2-w7']},
 {t:'2. Imperatives, sequence, warnings',ids:['u2-i5','u2-o1','u2-sq1','u2-w1']},
 {t:'3. Paragraph organisation part by part',ids:['u2-pw1']},
 {t:'4–5. Diagram → plan → paragraph',ids:['u2-o3','u2-pw2']}]},
{id:'rev3',u:3,title:'Revision 3 · Personal Recount',sub:'Hocanın gerçek revizyon kâğıdı (çözümlü)',parts:[
 {t:'1. Orientation',ids:['u3-o5','u3-o6','u3-o7','u3-o8']},
 {t:'2. Past simple & time markers',ids:['u3-t5','u3-p4','u3-t2','u3-s3']},
 {t:'3. Part by part',ids:['u3-o9','u3-s5','u3-r9']},
 {t:'4–5. Plan & write',ids:['u3-s6','u3-pw1']}]},
{id:'mock1',u:1,title:'Deneme B · Unit 1',sub:'Yeni sorular, sınav formatında',parts:[
 {t:'Part 1',ids:['b1-1','b1-2','u1-ts2']},
 {t:'Part 2',ids:['b1-3','b1-4','u1-s6']},
 {t:'Part 3',ids:['b1-5','b1-6']},
 {t:'Part 4',ids:['b1-7','u1-c3']},
 {t:'Part 5 · Writing',ids:['b1-8']}]},
{id:'mock2',u:2,title:'Deneme B · Unit 2',sub:'Yeni sorular, sınav formatında',parts:[
 {t:'Part 1',ids:['b2-1','u2-ts1']},
 {t:'Part 2',ids:['b2-2','b2-3','b2-4']},
 {t:'Part 3',ids:['b2-5']},
 {t:'Part 5 · Writing',ids:['b2-6']}]},
{id:'mock3',u:3,title:'Deneme B · Unit 3',sub:'Yeni sorular, sınav formatında',parts:[
 {t:'Part 1',ids:['b3-1','b3-2']},
 {t:'Part 2',ids:['b3-3','b3-4','b3-5','b3-6']},
 {t:'Part 5 · Writing',ids:['b3-7']}]}
];

window.PLAN = [
 {id:'pl1',time:'15 dk',title:'Sınav stratejisini oku',desc:'"Strateji" sekmesi: sınav formatı, altın kurallar, hocanın kırmızı kalemi.',go:'strateji'},
 {id:'pl2',time:'25 dk',title:'Unit 1 özeti + şablonu',desc:'Topic sentence, major/minor, signalling, concluding, reference, unity. Şablonu sesli oku.',go:'u1'},
 {id:'pl3',time:'25 dk',title:'Unit 1 alıştırmaları',desc:'Alıştırmalar → Unit 1. Yanlışları tekrar çöz.',go:'ex1'},
 {id:'pl4',time:'20 dk',title:'Unit 2 özeti + şablonu',desc:'Imperative, sequence, warning, useful detail, result.',go:'u2'},
 {id:'pl5',time:'20 dk',title:'Unit 2 alıştırmaları',desc:'Alıştırmalar → Unit 2.',go:'ex2'},
 {id:'pl6',time:'20 dk',title:'Unit 3 özeti + şablonu',desc:'Orientation, past simple, time markers, show don\'t tell, reorientation.',go:'u3'},
 {id:'pl7',time:'20 dk',title:'Unit 3 alıştırmaları',desc:'Alıştırmalar → Unit 3.',go:'ex3'},
 {id:'pl8',time:'60 dk',title:'3 revizyon kâğıdını çöz',desc:'Denemeler → Revision 1, 2, 3. Paragrafları GERÇEKTEN yaz, analizöre bak, modelle karşılaştır.',go:'mocks'},
 {id:'pl9',time:'45 dk',title:'Deneme B sınavları',desc:'En az bir tanesini süre tutarak yap (önerim: Unit 2 veya 3).',go:'mocks'},
 {id:'pl10',time:'—',title:'UYU 😴',desc:'En az 5–6 saat uyu. Yorgun beyin paragraf yazamaz.',go:''},
 {id:'pl11',time:'20 dk (sabah)',title:'Son tekrar kartları',desc:'"Kartlar" sekmesi + 3 şablonu bir kez kâğıda yaz.',go:'cards'}
];

window.CARDS = [
 {f:'Topic sentence = ?',b:'Topic + Controlling idea. Tam cümle (başlık, soru, liste, fragment değil). Ne çok genel ne çok özel.'},
 {f:'Controlling idea ne yapar?',b:'Konu hakkındaki özel fikri verir, destek cümlelerinde ne geleceğini söyler, paragraf türünü belirler (reasons / effects / steps / qualities).'},
 {f:'Major vs Minor detail',b:'Major: topic sentence\'ı doğrudan destekler. Minor: major\'ı fact / example ile açıklar. En az 2 major (görevde 3) ve her birine en az 1 minor.'},
 {f:'Major detail signals',b:'First, / First of all, / To begin with, / Second, / Third, / Also, / In addition, / Another reason is that… / Finally,'},
 {f:'Example signals',b:'For example, / For instance, / To illustrate, / To give an example, / such as + noun'},
 {f:'Result signals',b:'As a result, / Therefore, / Because of this, / Consequently, / That is why'},
 {f:'Further point signals',b:'Also, / In addition, / Moreover, / Furthermore, / In fact,'},
 {f:'Concluding signals',b:'In conclusion, / To conclude, / In short, / To sum up, / Overall, / For these reasons, / For all these reasons, / That is why / All in all, / In summary,'},
 {f:'Concluding sentence: 5 kural',b:'✓ Restate in new words ✓ Final thought / recommendation ✗ No new information ✗ Don\'t copy TS word-for-word ✓ Use a signal phrase'},
 {f:'Reference words',b:'it / they / them / there / this / these / he / she / his / its. Tekrarı önler, ama neyi gösterdiği açık olmalı.'},
 {f:'Paragraph unity',b:'Her cümle controlling idea\'yı desteklemeli. Konu dışı cümle (irrelevant) çıkarılır. Profilde uymayan fikri kullanma.'},
 {f:'Fragment örneği',b:'"Because the café is quiet." ✗ → "I go there because it is quiet." ✓'},
 {f:'U2: Instruction TS kalıbı',b:'You can [task] in a few simple steps. / [Doing task] is easy if you follow these steps. / … requires careful planning.'},
 {f:'U2: Imperative',b:'Base verb + no subject: Open… / Add… / Check… Negative: Do not / Don\'t + base verb. ✗ You should write → ✓ Write'},
 {f:'U2: Sequence words',b:'First, → Second, → Next, → Then, → After that, → Finally, (+ In the next step, Now)'},
 {f:'U2: Useful details',b:'how much / how long / where / which file or button. Örn: two or three teaspoons, for 10–15 minutes, the paperclip button.'},
 {f:'U2: Warning ifadeleri',b:'Make sure… / Be careful (with)… / Remember to… / Do not… / Don\'t forget to…'},
 {f:'U2: Conclusion',b:'RESULT gösterir, yeni adım değil: Your … is now ready. / Now your tea is ready to enjoy. / In this way, …'},
 {f:'U2: Planlama 6 adım',b:'1 List what you need 2 Choose action verbs 3 Put actions in order 4 Add signalling words 5 Add useful details 6 Add warnings if needed'},
 {f:'U2: Staff have to wash their hands carefully →',b:'Wash your hands carefully.'},
 {f:'U2: You must not run →',b:'Do not run. / Don\'t run.'},
 {f:'U3: Recount nedir?',b:'Yazarın kendi hayatından gerçek bir deneyim. Zaman sırası, I/my, past simple, duygular.'},
 {f:'U3: 3 aşama',b:'1 Orientation (who, what, when, where) 2 Record of events (time order + details) 3 Reorientation (feeling / comment / lesson)'},
 {f:'U3: Orientation kalıbı',b:'[When], [who] [past verb + what] [at/in where]. Last Friday, my dorm friends organised a surprise farewell party in the common room.'},
 {f:'U3: Past simple 4 kalıp',b:'regular -ed (waited) · irregular (saw) · was/were (The room was empty) · did not + base verb (I did not recognise)'},
 {f:'U3: Time markers (4 işlev)',b:'Open: At first, First, One morning · Next: Then, Next, After that, A few minutes later · Unexpected: Suddenly, Just then, When… · Last: Finally, In the end'},
 {f:'U3: Show, don\'t tell, I was nervous →',b:'My voice cracked and my palms were sweaty.'},
 {f:'U3: Show, don\'t tell, I was scared →',b:'My hands were shaking and my heart was beating fast.'},
 {f:'U3: Show, don\'t tell, I was so happy →',b:'I couldn\'t stop smiling the whole way home.'},
 {f:'U3: Show, don\'t tell, I was embarrassed →',b:'My face turned red and I looked down at my shoes.'},
 {f:'U3: Reorientation türleri',b:'Final feeling (I felt tired but proud…) · Comment (It was a funny start…) · Lesson (That day, I learned… / From then on, I always…). Yeni olay YOK.'},
 {f:'Sihirli cümle sayısı',b:'8 cümle: 7–9 ve 6–8 aralıklarının ikisine de uyar. Ama soruda yazan sayıya her zaman uy.'},
 {f:'Her checklist\'in son maddesi',b:'Sentence structure, spelling, capital letters, punctuation. Bitirince 1 dk kontrol et.'},
 {f:'Hangi soru, hangi tür?',b:'benefits / place / reasons → U1 · How to / steps / diagram → U2 · experience / what happened / last… → U3'}
];
