--
-- PostgreSQL database dump
--

\restrict T8CkUD7oMOEeWxIJK9Bhtjd9crmSs7rij0bdCFtc20X1KzJHuF650Xbchnp3GFM

-- Dumped from database version 17.11 (7d7ea2a)
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: Brand; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Brand" (id, name, "normalizedName", "createdAt", "updatedAt") FROM stdin;
9ed1f966-5713-6185-f07e-a2b9f5be8d47	Acer	acer	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
9c2670ec-b883-2019-4caa-a5b6c47c5cf6	Asus	asus	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
3b957447-a3eb-12e9-1ae6-b59bdfb48250	Crucial	crucial	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
c2072d21-7679-d05f-9e5b-b94c666fce59	Dell	dell	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
b584ddca-6a22-90dc-7b7e-85c8c47f0642	HP	hp	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
6b1a57bf-5a81-1e0c-1ee0-47586ade8cdc	Kingston	kingston	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
d1f8af6e-5be2-a16d-7005-42c060b8abcc	Lenovo	lenovo	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
3b663317-f759-dda6-adb0-723ac09a5aa7	Logitech	logitech	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
274f0f11-c65a-6150-3ffa-ed23f938be3f	MSI	msi	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
1bb2201f-1e2b-4d34-ee5b-ea4d49ece633	Razer	razer	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
1d2c3610-c42b-7a4c-7a4e-87fa71480855	Samsung	samsung	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
bbb4bccf-d884-bced-cf5f-0f6aa156d8f2	Seagate	seagate	2026-10-05 18:37:59.932	2026-10-05 18:37:59.932
c7734e5f-7803-4b23-9fd9-9f8831cc1fbe	Red Dragon	red dragon	2026-10-10 20:53:00.57	2026-10-10 20:53:00.57
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Category" (id, "parentId", "nameAr", "nameEn", slug, "descriptionAr", "descriptionEn", "imageUrl", "sortOrder", "isActive", "createdAt", "updatedAt") FROM stdin;
3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	لابتوبات	Laptops	laptops	لابتوبات للعمل والدراسة والألعاب بمواصفات متنوعة.	Laptops for work, study, and gaming across varied specifications.	\N	10	t	2026-08-14 18:09:07.203	2026-08-14 18:10:37.246
8a199a86-6e1e-4672-85ad-999580b529ce	\N	إكسسوارات	Accessories	accessories	إكسسوارات مختارة لتجهيز الكمبيوتر واللابتوب.	Selected accessories for laptop and desktop setups.	\N	20	t	2026-08-14 18:09:07.319	2026-08-14 18:10:37.341
328362d1-3daf-4609-976d-153fc5b7e08d	8a199a86-6e1e-4672-85ad-999580b529ce	التخزين	Storage	storage	حلول تخزين داخلية ومحمولة بسرعات وسعات مختلفة.	Internal and portable storage in multiple speeds and capacities.	\N	10	t	2026-08-14 18:09:07.419	2026-08-14 18:10:37.434
9256f6aa-9e89-4b26-84fe-d3dcb465da15	8a199a86-6e1e-4672-85ad-999580b529ce	فأرات الكمبيوتر	Mice	mice	فأرات سلكية ولاسلكية للعمل والألعاب.	Wired and wireless mice for productivity and gaming.	\N	20	t	2026-08-14 18:09:07.537	2026-08-14 18:10:37.53
3c6486ba-ea23-4991-9a26-6f09860f94bd	8a199a86-6e1e-4672-85ad-999580b529ce	لوحات المفاتيح	Keyboards	keyboards	لوحات مفاتيح عملية وميكانيكية لمختلف الاستخدامات.	Practical and mechanical keyboards for different uses.	\N	30	t	2026-08-14 18:09:07.638	2026-08-14 18:10:37.633
6a6f04c0-ac87-46c1-9f54-c5499bb55487	8a199a86-6e1e-4672-85ad-999580b529ce	سماعات الرأس	Headsets	headsets	سماعات للمكالمات والألعاب والاستماع اليومي.	Headsets for calls, gaming, and everyday listening.	\N	40	t	2026-08-14 18:09:07.743	2026-08-14 18:10:37.725
ff66924f-0123-4ce1-b203-b95fbf9a744f	8a199a86-6e1e-4672-85ad-999580b529ce	شواحن اللابتوب	Chargers	chargers	شواحن وبدائل طاقة متوافقة مع أجهزة مختارة.	Chargers and power replacements for selected devices.	\N	50	t	2026-08-14 18:09:07.831	2026-08-14 18:10:37.829
73ba250c-c11d-4bd9-9057-b754bdcfe2e8	8a199a86-6e1e-4672-85ad-999580b529ce	حقائب اللابتوب	Laptop Bags	laptop-bags	حقائب لحماية اللابتوب وحمله بأمان.	Bags for carrying and protecting laptops safely.	\N	60	t	2026-08-14 18:09:07.931	2026-08-14 18:10:37.937
8e8d4ffe-d572-44a8-a129-38c3c80a179a	328362d1-3daf-4609-976d-153fc5b7e08d	أقراص SSD	SSD	ssd	أقراص تخزين SSD سريعة بواجهات NVMe وSATA.	Fast SSD storage using NVMe and SATA interfaces.	\N	10	t	2026-08-14 18:09:08.034	2026-08-14 18:10:38.041
0a8e5b78-8e6f-48de-b712-192630df5679	328362d1-3daf-4609-976d-153fc5b7e08d	أقراص HDD	HDD	hdd	أقراص صلبة بسعات كبيرة للأرشفة والتخزين.	High-capacity hard drives for storage and archiving.	\N	20	t	2026-08-14 18:09:08.134	2026-08-14 18:10:38.133
0a7736cf-f27c-4e1a-828d-51655cb5e075	328362d1-3daf-4609-976d-153fc5b7e08d	ذواكر فلاش	Flash Drives	flash-drives	ذواكر USB صغيرة لنقل الملفات بسهولة.	Compact USB drives for convenient file transfers.	\N	30	t	2026-08-14 18:09:08.222	2026-08-14 18:10:38.241
\.


--
-- Data for Name: Product; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Product" (id, slug, sku, name, "categoryId", "descriptionAr", "descriptionEn", "shortDescriptionAr", "shortDescriptionEn", "priceUsdCents", "stockStatus", condition, "isFeatured", "isActive", "extraSpecs", "createdAt", "updatedAt", "brandId") FROM stdin;
444e2cee-2cb4-4759-b6d0-f30b4772e16d	lenovo-ideapad-slim-3-15iru8	LNV-IPS3-15IRU8-001	Lenovo IdeaPad Slim 3 15IRU8	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب عملي وخفيف للاستخدام اليومي والدراسة مع معالج Core i5 وتخزين NVMe سريع.	A practical everyday laptop for study and office work with a Core i5 processor and fast NVMe storage.	خيار عملي للدراسة والعمل اليومي.	A practical choice for study and everyday work.	59900	IN_STOCK	NEW	f	t	{"color": "Arctic Grey", "webcam": "HD 720p", "graphics": "Integrated", "keyboardLayout": "English/Arabic", "operatingSystem": "Windows 11 Home"}	2026-08-14 18:09:08.552	2026-08-14 18:10:38.547	d1f8af6e-5be2-a16d-7005-42c060b8abcc
44ba4635-c1e4-4cdb-93c0-508709be0922	acer-nitro-v-15-anv15-51	ACE-NV15-ANV15-51-001	Acer Nitro V 15 ANV15-51	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب ألعاب متوسط بمعالج Core i5 وبطاقة RTX 4050 يقدم توازناً جيداً بين السعر والأداء.	A mid-range gaming laptop with a Core i5 processor and RTX 4050 graphics, balancing price and performance.	توازن جيد بين السعر وأداء RTX 4050.	Balanced value with RTX 4050 performance.	94999	IN_STOCK	NEW	f	t	{"color": "Obsidian Black", "gpuMemoryGB": 6, "refreshRateHz": 144, "operatingSystem": "Windows 11 Home", "keyboardBacklight": "White"}	2026-08-14 18:09:10.127	2026-08-14 18:10:40.177	9ed1f966-5713-6185-f07e-a2b9f5be8d47
93fc71ff-c836-4d8e-94a8-49809f82504c	asus-vivobook	\N	Asus Vivobook	3d5d1f44-76bd-4f6d-b03a-8c4138553046	ملاحظة : السعر قابل للتغيير \r\nرجاء تأكد عبر تواصل مع فريق دعم الفني	Note: Price is subject to change\r\nPlease confirm by contacting the technical support team	\N	\N	70000	IN_STOCK	NEW	f	t	\N	2026-10-03 20:38:55.617	2026-10-05 15:08:05.027	9c2670ec-b883-2019-4caa-a5b6c47c5cf6
25b90f15-20e3-494c-9fcb-b97348d02264	crucial-bx500-1tb	CRU-BX500-1TB-001	Crucial BX500 1TB SATA SSD	8e8d4ffe-d572-44a8-a129-38c3c80a179a	قرص SATA SSD بسعة 1TB لترقية الأجهزة التي تدعم أقراص 2.5 بوصة.	A 1TB SATA SSD for upgrading systems that support 2.5-inch drives.	ترقية SATA SSD اقتصادية بسعة 1TB.	An affordable 1TB SATA SSD upgrade.	6499	IN_STOCK	NEW	f	t	{"interface": "SATA III", "capacityGB": 1024, "formFactor": "2.5-inch", "sequentialReadMBps": 540}	2026-08-14 18:09:11.066	2026-08-14 18:10:41.069	3b957447-a3eb-12e9-1ae6-b59bdfb48250
fb451a60-610e-4d91-b1e9-254ea8032bdb	dell-latitude-5420	DEL-LAT-5420-USED-001	Dell Latitude 5420	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب أعمال مستعمل بحالة جيدة، صغير الحجم ومناسب للعمل المتنقل والمهام المكتبية.	A used business laptop in good condition with a compact design suited to mobile and office work.	جهاز أعمال مستعمل وخفيف للعمل المتنقل.	A compact used business laptop for mobile work.	44900	IN_STOCK	USED	f	t	{"color": "Titan Gray", "graphics": "Integrated", "conditionNote": "Minor cosmetic wear", "warrantyMonths": 3, "operatingSystem": "Windows 11 Pro"}	2026-08-14 18:09:09.916	2026-08-14 18:10:39.934	c2072d21-7679-d05f-9e5b-b94c666fce59
53a3471d-7dce-49f4-b97d-7e7390eb2a9f	dell-g15-5530	DEL-G15-5530-001	Dell G15 5530	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب ألعاب متين بمعالج Core i7 وبطاقة RTX 4060 وقرص 1TB للألعاب والمشاريع الثقيلة.	A durable gaming laptop with a Core i7 processor, RTX 4060 graphics, and 1TB storage for demanding games and projects.	أداء قوي للألعاب والمشاريع الثقيلة.	Powerful performance for games and demanding projects.	149900	ON_REQUEST	NEW	t	t	{"color": "Dark Shadow Gray", "ethernet": "Gigabit", "gpuMemoryGB": 8, "refreshRateHz": 165, "operatingSystem": "Windows 11 Home", "keyboardBacklight": "Orange"}	2026-08-14 18:09:09.678	2026-08-14 18:10:39.701	c2072d21-7679-d05f-9e5b-b94c666fce59
6d4c16f8-4b34-4d57-80c8-81e8f8bc4421	hp-probook-450-g10	HP-PB450-G10-001	HP ProBook 450 G10	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب أعمال مجدد بحالة جيدة مع معالج Core i7 وذاكرة 16GB للاستخدام المكتبي والمهني.	A professionally refurbished business laptop with a Core i7 processor and 16GB RAM for office and professional use.	جهاز أعمال مجدد بمواصفات عملية.	A refurbished business laptop with practical specifications.	62900	IN_STOCK	REFURBISHED	f	t	{"color": "Pike Silver", "graphics": "Integrated", "warrantyMonths": 6, "operatingSystem": "Windows 11 Pro", "fingerprintReader": true}	2026-08-14 18:09:09.447	2026-08-14 18:10:39.483	b584ddca-6a22-90dc-7b7e-85c8c47f0642
88ab96a0-8f5f-4d88-a618-f87449acb861	hp-victus-15-fa1093dx	HP-VIC15-FA1093DX-001	HP Victus 15-fa1093dx	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب ألعاب عملي بمعالج Core i5 وبطاقة RTX 3050 مناسب للألعاب بدقة Full HD وصناعة المحتوى.	A practical gaming laptop with a Core i5 processor and RTX 3050 graphics for Full HD gaming and content creation.	ألعاب Full HD مع بطاقة RTX 3050.	Full HD gaming powered by RTX 3050 graphics.	89900	ON_REQUEST	NEW	t	t	{"color": "Mica Silver", "gpuMemoryGB": 6, "refreshRateHz": 144, "operatingSystem": "Windows 11 Home", "keyboardBacklight": "White"}	2026-08-14 18:09:09.216	2026-08-14 18:10:39.23	b584ddca-6a22-90dc-7b7e-85c8c47f0642
3ebf9170-d5b7-42d0-a56d-e7483caf8bd6	kingston-datatraveler-exodia-128gb	KIN-DTX-128GB-001	Kingston DataTraveler Exodia 128GB USB 3.2	0a7736cf-f27c-4e1a-828d-51655cb5e075	ذاكرة فلاش USB بسعة 128GB لنقل الملفات والمستندات بسهولة.	A 128GB USB flash drive for convenient document and file transfers.	ذاكرة USB 3.2 بسعة 128GB.	A compact 128GB USB 3.2 drive.	1499	IN_STOCK	NEW	f	t	{"color": "Black", "connector": "USB-A", "interface": "USB 3.2 Gen 1", "capacityGB": 128}	2026-08-14 18:09:11.442	2026-08-14 18:10:41.469	6b1a57bf-5a81-1e0c-1ee0-47586ade8cdc
22a1e9f3-69c0-4136-b5ce-778d5dcec59d	logitech-m185-wireless-mouse	LOG-M185-001	Logitech M185 Wireless Mouse	9256f6aa-9e89-4b26-84fe-d3dcb465da15	فأرة لاسلكية مريحة وموثوقة للعمل والدراسة والاستخدام اليومي.	A comfortable and reliable wireless mouse for work, study, and everyday use.	فأرة لاسلكية عملية للاستخدام اليومي.	A practical wireless mouse for everyday use.	1999	IN_STOCK	NEW	f	t	{"sensorDpi": 1000, "handedness": "Ambidextrous", "batteryType": "AA", "connectivity": "2.4GHz wireless"}	2026-08-14 18:09:11.663	2026-08-14 18:10:41.697	3b663317-f759-dda6-adb0-723ac09a5aa7
771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	msi-modern-14-c7m	MSI-MOD14-C7M-001	MSI Modern 14 C7M	3d5d1f44-76bd-4f6d-b03a-8c4138553046	لابتوب 14 بوصة خفيف بمعالج Ryzen 5 مناسب للطلاب والعمل المكتبي والتنقل اليومي.	A lightweight 14-inch Ryzen 5 laptop for students, office work, and daily mobility.	جهاز Ryzen 5 خفيف للطلاب والتنقل.	A lightweight Ryzen 5 laptop for students and mobility.	57900	IN_STOCK	NEW	f	t	{"color": "Classic Black", "graphics": "Integrated", "weightKg": 1.4, "operatingSystem": "Windows 11 Home", "keyboardBacklight": "White"}	2026-08-14 18:09:10.614	2026-08-14 18:10:40.625	274f0f11-c65a-6150-3ffa-ed23f938be3f
f8fe9290-4965-4adc-b484-0531ea229ea6	razer-deathadder-essential	RAZ-DA-ESS-001	Razer DeathAdder Essential Gaming Mouse	9256f6aa-9e89-4b26-84fe-d3dcb465da15	فأرة ألعاب سلكية بتصميم مريح وحساس دقيق للاستخدام التنافسي واليومي.	A wired gaming mouse with an ergonomic design and precise sensor for competitive and everyday use.	فأرة ألعاب سلكية بتصميم مريح.	An ergonomic wired gaming mouse.	2999	IN_STOCK	NEW	f	t	{"lighting": "Green", "sensorDpi": 6400, "connectivity": "Wired USB", "programmableButtons": 5}	2026-08-14 18:09:11.871	2026-08-14 18:10:41.909	1bb2201f-1e2b-4d34-ee5b-ea4d49ece633
d1a76472-2597-4579-a15e-2fa2008a6bec	samsung-990-evo-1tb	SAM-990EVO-1TB-001	Samsung 990 EVO 1TB NVMe SSD	8e8d4ffe-d572-44a8-a129-38c3c80a179a	قرص NVMe سريع بسعة 1TB مناسب لترقية اللابتوب والكمبيوتر المكتبي.	A fast 1TB NVMe SSD for upgrading compatible laptops and desktops.	قرص NVMe سريع بسعة 1TB.	A fast 1TB NVMe solid-state drive.	8999	IN_STOCK	NEW	f	t	{"interface": "PCIe 4.0 x4 / PCIe 5.0 x2", "capacityGB": 1024, "formFactor": "M.2 2280", "sequentialReadMBps": 5000}	2026-08-14 18:09:10.843	2026-08-14 18:10:40.861	1d2c3610-c42b-7a4c-7a4e-87fa71480855
4fd2ba13-f703-4ed5-8395-dd001901aeac	seagate-barracuda-2tb-hdd	SEA-BARRA-2TB-001	Seagate BarraCuda 2TB HDD	0a8e5b78-8e6f-48de-b712-192630df5679	قرص صلب بسعة 2TB للتخزين المكتبي والأرشفة والنسخ الاحتياطي.	A 2TB desktop hard drive for storage, archiving, and backups.	سعة 2TB للأرشفة والتخزين.	A 2TB drive for storage and archiving.	6999	ON_REQUEST	NEW	f	t	{"interface": "SATA III", "capacityGB": 2048, "formFactor": "3.5-inch", "spindleSpeedRPM": 7200}	2026-08-14 18:09:11.248	2026-08-14 18:10:41.262	bbb4bccf-d884-bced-cf5f-0f6aa156d8f2
a7fbb77c-25c8-43c1-a0d1-b86eee104946	testsetse	\N	Asus Vivobook	3d5d1f44-76bd-4f6d-b03a-8c4138553046	testtes	testset	\N	\N	9999900	ON_REQUEST	USED	t	t	\N	2026-10-09 12:58:22.597	2026-10-09 21:08:45.4	9c2670ec-b883-2019-4caa-a5b6c47c5cf6
\.


--
-- Data for Name: AnalyticsEvent; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AnalyticsEvent" (id, "eventType", "visitorId", "sessionId", "productId", "categoryId", channel, placement, locale, metadata, "createdAt") FROM stdin;
91063958-1612-43c9-8d83-092d12cf61e0	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-26 08:35:14.881
8d5b6b9e-1717-4875-8e0e-ba952a381792	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:36:28.483
c12b888e-7d4f-4e3d-9884-30a641da8180	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:36:49.63
cb84dc41-b322-46c6-8522-dc16ab4fa587	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-08-26 08:37:47.28
b0a21b21-7e6d-4956-9b93-92d6c50bc78e	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-08-26 08:38:40.102
9d5089f3-5632-4559-b5c7-261961d8ad5e	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-08-26 08:40:07.777
e0576e2f-c36e-4c27-9a2d-e4c8a5a80727	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	en	{"pathname": "/en/products/lenovo-legion-5-16irx9"}	2026-08-26 08:41:59.293
fa0e3672-65e8-4d11-965b-f251bc40a6b5	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-08-26 08:42:03.109
77d1453f-66e6-420b-bc1d-489b2a607c45	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-26 08:42:17.674
b2004adb-3037-4471-beb7-51d755764c23	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:42:18.229
1568c898-afc3-40eb-aafd-236ef941a733	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	en	{"pathname": "/en/products/lenovo-legion-5-16irx9"}	2026-08-26 08:42:20.854
c6c72606-914b-4744-ae2d-3ed3e7a696ab	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-08-26 08:43:31.324
f76b8537-ba33-4a4f-96b5-1bacb5582e3a	PAGE_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	6b666010-557e-4ca0-b900-ebac062dc6e8	\N	\N	\N	\N	en	{"pathname": "/en/products/lenovo-legion-5-16irx9"}	2026-08-26 08:45:38.656
76b591c5-9c55-48c8-a1e0-83104095457e	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:49:21.735
e39f45be-d3c8-47da-b054-9d877ea1a22e	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:49:25.306
7444c931-e6da-4d4d-9485-879f41335eda	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-26 08:49:28.912
72a3e12d-e6b6-4582-978c-4e0bb9421690	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 08:50:56.295
65c8799b-a5ea-4a10-9b49-7e8aba5ea6e6	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-26 08:51:04.29
da73e715-184d-45f9-b663-3ec3e194de91	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 09:21:03.865
142b816d-9a44-4a2c-9ed3-963c1da7369f	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 09:21:22.201
ef116309-f90f-4aa3-b9af-faa82e889f7d	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 09:21:37.465
93152d7e-bb1c-4fbf-992d-08629042e2c2	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products/dell-latitude-5420"}	2026-08-26 09:22:00.303
39012435-ccdd-47f4-889e-5f04b4c60939	PRODUCT_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	fb451a60-610e-4d91-b1e9-254ea8032bdb	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 09:22:02.809
6c37901b-d600-45d1-80cd-63d351444672	ORDER_INTENT	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	fb451a60-610e-4d91-b1e9-254ea8032bdb	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 09:22:08.782
e3923680-ac32-4d9b-81d2-4356800e2272	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-08-26 09:23:05.14
74165a2e-47e2-4cec-b6e3-0eaf85377334	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products/dell-latitude-5420"}	2026-08-26 09:27:42.139
4e0b70a6-1d36-4909-bbb4-66db6adb5c6b	PRODUCT_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	fb451a60-610e-4d91-b1e9-254ea8032bdb	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 09:27:42.272
de9e5a02-46f5-4b89-8f6f-856e45067455	PAGE_VIEW	8fc16cd2-9066-498f-bd31-f96ef0bc3559	dcc5d2b6-ed28-4c94-9663-5226f07864b6	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 11:41:45.977
f2303fa0-1d23-444b-9355-d545b358cf79	PAGE_VIEW	e58079a5-a6b0-4118-ae34-2d2da4224408	ecd67edc-da49-468b-85b4-f4b6a2ee3800	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 11:41:50.151
f779cf53-8e17-45d5-bb03-b72719e34e72	PAGE_VIEW	8cce94d6-5f6a-4ff2-aeef-e4ed25e1f4a7	652e22b8-9870-4701-9cca-d7dee81f5c33	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 12:24:24.67
55565491-33c3-4834-887a-0634d97ac8ee	PAGE_VIEW	156c677e-48f0-429f-9190-4599bcb6347d	b9cf1ca6-ba0c-4dff-9af0-c9ccf2dfb1c7	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 12:24:25.383
44926296-e874-4d17-ad23-0394ab59b04b	PAGE_VIEW	bfe86e3a-d7a1-4255-a9aa-87c2bf58a36e	47477ee6-97e7-4c7a-a6db-d0c1f71b3ccb	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 13:35:19.038
5e1ef5af-1cfb-4b28-8267-2729739b98b0	PAGE_VIEW	6196c447-b3c7-4c6a-98d7-054c016c61d6	d352d0ec-8dd0-4702-8308-8f6518bc33e9	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-28 13:35:19.172
86374d72-6680-4202-9bac-32e87ea5d59f	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	\N	\N	\N	\N	ar	{"pathname": "/products/dell-latitude-5420"}	2026-08-30 03:44:56.72
fa671a32-11af-4ed5-9128-03c95aa09a0c	PRODUCT_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	a9915bf8-23b0-4086-9b60-36a3acdfc314	fb451a60-610e-4d91-b1e9-254ea8032bdb	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-30 03:44:56.9
a6c2cb0a-c959-41d5-9338-15c3da5d59ae	PAGE_VIEW	d3832199-8624-48a2-99a5-8a470de72e60	c806154c-d3b7-4960-9be6-619765bde0b5	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-30 04:25:52.711
87317d45-71bf-4100-961c-2c042ed816f3	PAGE_VIEW	d3832199-8624-48a2-99a5-8a470de72e60	c806154c-d3b7-4960-9be6-619765bde0b5	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-08-30 04:26:12.186
3ee59791-91dc-4e49-8b7e-3d6b20bb5700	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	92434d23-b3ad-487f-b5fe-baf994e84ba2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-08-30 05:48:03.955
d9a6f1dd-169e-4ca1-b595-d3c380f457ae	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	de764d35-4cf5-4bdd-84fa-1928f89be182	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-01 14:26:29.309
50f5d15d-4c2b-471e-91e5-3292bcaae5d7	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	ac8ef3f4-fe49-4b83-994b-844a7907b396	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-02 14:51:25.263
dfe749f6-a159-419c-a59b-fb137e44ec97	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	68d00470-24a9-4e8c-baa1-15921cf1fb92	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-02 16:17:03.7
14901035-03ac-4a80-a6cf-c8137dd54b01	PAGE_VIEW	53ea496d-f581-4360-a6b4-c697db8c9f10	5e66e086-8879-47c2-be79-8e5e8c433349	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 08:19:30.071
ecc36e52-f32f-4ba0-a5bb-9523eebf7814	PAGE_VIEW	2e6acdfe-bb96-4d15-813a-a8a2a5b440ff	096573f6-619f-40c1-bc12-382314959098	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 08:19:29.993
7e11cc54-77c5-4c1c-9211-7438b1c484ff	PAGE_VIEW	1195adba-b3f0-428d-9861-1ffa35e07434	8968ef7c-b5e1-4740-afac-425047d25388	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 10:11:08.223
45db8614-5d24-4a81-81a5-347b3a19c6ae	PAGE_VIEW	1195adba-b3f0-428d-9861-1ffa35e07434	da5560cd-fde1-4940-b568-64cc79918a7a	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 10:21:53.915
b513f402-abde-4c3e-8922-f6b5b6b14c83	PAGE_VIEW	1195adba-b3f0-428d-9861-1ffa35e07434	da5560cd-fde1-4940-b568-64cc79918a7a	\N	\N	\N	\N	ar	{"pathname": "/products/lenovo-legion-5-16irx9"}	2026-09-09 10:22:39.762
949985bb-e605-4adc-a606-fa110b44a901	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	49725e01-2899-4251-819e-23a9fa2b75c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 19:22:16.281
f0e60196-f022-4f81-b5b2-919f4ff1e01e	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	49725e01-2899-4251-819e-23a9fa2b75c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:16:06.771
523a1cb6-bd59-4949-adb4-ab1adc033724	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	97a6d410-3e7a-4558-bd9b-dedd1c8454c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:06.758
ecf05f2d-22da-4998-9e99-6dc6d835fe67	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	97a6d410-3e7a-4558-bd9b-dedd1c8454c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:09.488
5bce9f19-11d2-4976-b6c2-1677dacc3b7d	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	97a6d410-3e7a-4558-bd9b-dedd1c8454c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:22.868
787f7717-2cce-46bb-8bc8-d9e5a7afa00c	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	97a6d410-3e7a-4558-bd9b-dedd1c8454c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:28.165
990f43c0-d76e-4adf-9d56-46960bf77290	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:31.027
e3c61584-66f2-4700-8475-c9146f8cdd75	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:18:57.05
58c1a2a6-cc7a-4b81-b779-4d037f7469dd	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:19:30.44
c705db1c-59a5-4bee-ba0f-8689e627462d	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:19:47.598
614770e6-54ca-4eb3-bf75-9c1d0f04e4c8	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:20:29.507
99767d5e-0713-48d7-ad0d-09c02f876c60	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:20:40.258
3bb142a2-2ad0-4a50-891a-d85b74b7b0d4	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-09 21:20:55.458
9db44a34-b01d-4503-b274-0e2cb79643b0	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-09 21:22:17.197
d47537be-9efc-4e81-9594-15b183dc22bd	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-09 21:22:18.972
4052655e-cd26-41b8-be9d-3f8eed053c80	PAGE_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	\N	\N	\N	ar	{"pathname": "/products/acer-aspire-5-a515-48m"}	2026-09-09 21:22:23.362
0b8e7e5e-5a64-4b96-898a-97f1cf09c3ff	PAGE_VIEW	7de5f568-2ef0-4903-bf75-b54d7158b041	226bf563-be06-491f-8aa3-416c3c729c07	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-12 10:19:55.663
15585f3f-edf4-49c1-b6a1-c2fcfbb6a28f	PAGE_VIEW	1e3c9dd9-4c2b-4d14-823f-4f8103fd52e2	a8dcc89d-1efc-48e2-ac31-45467db175f1	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-13 20:47:56.452
08c0702b-e804-471f-9e14-9ae30eb33533	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	bc580e13-3561-4e23-b238-eae64dab1564	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-16 13:11:02.254
b0535c6b-c32a-4e3f-b403-d45ad74b1f46	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	bc580e13-3561-4e23-b238-eae64dab1564	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-16 13:11:05.402
11375e8d-93a8-49cb-bdd5-09bbb39072b0	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	bc580e13-3561-4e23-b238-eae64dab1564	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-16 13:11:20.985
37368b21-c9ac-426d-a34c-16827ba6e9d9	PAGE_VIEW	d11ec70e-9c43-42e1-b438-706a73994fac	05ddf794-ccda-461e-b814-2d5e1fd53ddd	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-16 13:11:26.307
8786a2f0-8554-429a-8313-0d51c2dbfe8f	PAGE_VIEW	5b9017f6-be94-456e-bab1-87f6af7b17c7	347297c1-48ff-4771-af57-d129a6c39676	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-16 13:11:43.932
92620ae1-fbc5-4a9f-91bd-91dbd5a4dfcd	PAGE_VIEW	d11ec70e-9c43-42e1-b438-706a73994fac	05ddf794-ccda-461e-b814-2d5e1fd53ddd	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-16 13:11:45.052
8f9406ea-76ef-4c32-bd80-2422b2f39bec	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	34702e37-1806-4dc4-a98b-75b1af86d066	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-17 17:33:04.403
74f4a86c-588e-4d1f-85c5-ff0a6e55c12e	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	d0db74aa-c379-4520-8082-871b65cd2cc3	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-17 17:35:36.256
39ee23af-d557-460b-9ff1-71ff1ef19f83	PRODUCT_VIEW	1195adba-b3f0-428d-9861-1ffa35e07434	da5560cd-fde1-4940-b568-64cc79918a7a	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-09 10:22:40.793
431a7af6-62e5-4e09-a994-5f7cde1e4b23	ORDER_INTENT	1195adba-b3f0-428d-9861-1ffa35e07434	da5560cd-fde1-4940-b568-64cc79918a7a	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-09 10:22:43.427
6de6fd3e-6b4c-4519-aec1-8836d4bfef5d	PAGE_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-20 20:37:01.223
ab45a0d4-6864-436c-bcee-a3babd43e0a1	PAGE_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-20 20:37:01.506
b5e8501e-10cb-44c3-b212-64f2b0de89a4	PAGE_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-20 20:37:01.754
0cff5002-1105-4a23-bcb5-2cf6ab8699cb	PAGE_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-20 20:37:01.912
a99f9e9f-1496-4ce5-9ea0-9e5e11450757	PAGE_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-20 20:37:02.921
77befac6-6762-4b76-8801-9df44470fa15	PAGE_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-20 20:39:08.228
ab45119e-236a-4482-8581-d69084967b26	PAGE_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-20 20:39:08.875
3f2f3192-4fee-4277-8386-5fd447009f57	PAGE_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-20 20:39:10.109
75beca6d-8f19-4bc9-9bbe-2a9ed7cd6a69	PAGE_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-20 20:39:10.538
3797a529-c27f-425e-a8d5-820a999bdd98	PAGE_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-20 20:39:12.493
a3ebd497-7829-4cf6-97d6-f54a06a4c9d9	PAGE_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-20 20:41:36.223
dfb75263-863b-4a0b-98d2-7962003829d8	PAGE_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-20 20:41:36.734
95bd5f70-7758-4ba8-97a4-c7dce3848d1c	PAGE_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-20 20:41:37.961
d10120b4-d7d4-4b4b-a8ad-ec2dbe967514	PAGE_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-20 20:41:38.372
5eba6342-f8e8-4b16-a154-b097fc2407da	PAGE_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-20 20:41:39.856
6c8ea524-5d55-4f4b-b922-1c3b5e3d7e62	PAGE_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-20 20:54:17.859
85fb8a68-2172-4a3d-a51f-fc3621025b09	PAGE_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-20 20:54:18.033
c571e7c5-17eb-4bfe-98a1-a00723c2f826	PAGE_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-20 20:54:18.613
5a1be3f8-e776-4ba5-824c-06b0bcfbf040	PAGE_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-20 20:54:18.355
504ee3b6-4091-48f4-96a1-a9037c8b4086	PAGE_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-20 20:54:19.773
01603ef4-e538-4820-81fa-58aa9e34d2e1	PAGE_VIEW	e92e6b50-321d-4852-8b19-70e4b6ce0e18	cca28c06-f88d-4b14-84fc-437d062de7a2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 06:21:50.191
a374d768-1b32-4c0d-9f5d-72c064898a20	PAGE_VIEW	e92e6b50-321d-4852-8b19-70e4b6ce0e18	cca28c06-f88d-4b14-84fc-437d062de7a2	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 06:21:50.664
4f3db65c-b7c3-485f-aa54-79a04baf3eff	PAGE_VIEW	e92e6b50-321d-4852-8b19-70e4b6ce0e18	cca28c06-f88d-4b14-84fc-437d062de7a2	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 06:21:51.45
e87d83c1-e75b-46b3-9f33-f7ca2467b4ca	PAGE_VIEW	e92e6b50-321d-4852-8b19-70e4b6ce0e18	cca28c06-f88d-4b14-84fc-437d062de7a2	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 06:21:51.01
41c4d90a-f4af-41e7-b925-24c6f151ae98	PAGE_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 06:22:08.784
a9da6690-7c46-494b-b626-052153cc15bb	PAGE_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 06:22:09.227
621b82ba-f5b8-47b6-8cc3-4fb12755616d	PAGE_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 06:22:10.639
b0165a8e-4bfb-4b20-bb23-0c095c358fe9	PAGE_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 06:22:11.378
292182cb-9af5-4574-85e8-a9304ee03c07	PAGE_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 06:22:12.965
d31acbf9-3b59-4b65-a301-d57aefff3213	PAGE_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 06:22:54.748
3ac56b8b-e8b1-41de-bbcb-5d57e8e3e1f4	PAGE_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 06:22:55.449
ead754d9-8bc8-4d33-ab15-40e57802ae4d	PAGE_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 06:22:56.704
df375beb-756d-41f7-a8e6-8a382d748977	PAGE_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 06:22:57.062
50dbd1f4-d351-42ff-a74d-5c74ecf36ee4	PAGE_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 06:22:58.093
49f1fb7c-5f82-4aa6-b71b-aebd63080ee4	PAGE_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 07:46:59.337
20d17edd-7a27-4741-a3e7-7783e4b8956d	PAGE_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 07:46:59.645
6ffc1e65-f589-4f74-816b-89ca8cc9a4bb	PAGE_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 07:47:02.066
7c9df3ed-835d-435f-8f97-fb94d3874be1	PAGE_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 07:47:02.457
22e29a98-b82c-409f-adc2-e79fdee73b42	PAGE_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 07:47:03.314
d956f497-d2f8-48e1-b6b3-913bdb383475	PAGE_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 07:48:41.357
38340d0a-80fc-4176-8378-8146a4eb7b34	PAGE_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 07:48:41.884
d12a1db3-8c59-48b7-87e4-4538ded7248f	PAGE_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 07:48:43.378
8d0da0fd-b98a-4090-9688-034e95079453	PAGE_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 07:48:44.274
17e0dd08-6460-4830-aa84-66172fbaf946	PAGE_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 07:48:44.948
9ac042f5-0893-465d-81b7-cbae008a6558	PAGE_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 07:50:06.586
b02ff48e-beda-4e46-8198-36ccf204f8e6	PAGE_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 07:50:07.322
56b8d565-6d70-4a1f-9e8e-fdbf07327284	PAGE_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 07:50:08.488
d5da91d6-010b-4ba5-9466-caaae7460cff	PAGE_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 07:50:08.795
ca63c6aa-9092-4ee3-9616-3895f1158c15	PAGE_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 07:50:10.577
6af7f616-9f45-466b-8efa-dd25af9f04b2	PAGE_VIEW	303bf732-1df3-4337-8ea3-1201da28070e	7ff56e4f-9bef-4a7b-8e1b-771622a306c4	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:01:38.239
9da13c58-841c-434c-94a0-d76f2177d02d	PAGE_VIEW	303bf732-1df3-4337-8ea3-1201da28070e	7ff56e4f-9bef-4a7b-8e1b-771622a306c4	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:01:38.677
e8deaecc-6fbe-453e-a233-3c27a1eea4f0	PAGE_VIEW	303bf732-1df3-4337-8ea3-1201da28070e	7ff56e4f-9bef-4a7b-8e1b-771622a306c4	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:01:38.993
fc10022e-2dc7-4a54-abcd-be8a7fe6ca93	PAGE_VIEW	303bf732-1df3-4337-8ea3-1201da28070e	7ff56e4f-9bef-4a7b-8e1b-771622a306c4	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:01:39.507
014b80ea-4cbe-4c08-bd99-19384474babd	PAGE_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 08:02:54.815
56fdf0bf-7d92-4e0e-bfe9-f9c3423222b3	PAGE_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:02:55.296
6ef68c1b-4f3b-4c8d-93b1-cb46a0e800d3	PAGE_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:02:56.883
286a1e26-2c03-4d59-9096-f6398c93f50c	PAGE_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:02:57.683
1433ea26-33eb-4d9d-8b29-4bff5430e5ae	PAGE_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:02:59.067
c3708b66-95a0-448a-8b0c-88ed89c933f1	PAGE_VIEW	8f9475c5-3e68-4fe1-ab6f-fcf96eb459c6	d7aec218-5a28-42b6-a3d7-660d2fad8f82	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:06:08.388
c375cb17-67f6-40da-8c42-7d592d4987ef	PAGE_VIEW	8f9475c5-3e68-4fe1-ab6f-fcf96eb459c6	d7aec218-5a28-42b6-a3d7-660d2fad8f82	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:06:09.207
e5de847f-366a-47e8-af76-ccee3a291ba2	PAGE_VIEW	8f9475c5-3e68-4fe1-ab6f-fcf96eb459c6	d7aec218-5a28-42b6-a3d7-660d2fad8f82	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:06:10.139
145353f0-7e8b-4599-91f0-4f5a830c442d	PAGE_VIEW	8f9475c5-3e68-4fe1-ab6f-fcf96eb459c6	d7aec218-5a28-42b6-a3d7-660d2fad8f82	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:06:11.617
7082289c-144a-4313-a60a-5532f0fdc799	PAGE_VIEW	607d05b4-b7d3-4a82-9f4e-9d8ca1c59ce8	4d8c1be6-afdd-4024-aad4-4af375c42029	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 08:11:43.883
bb5fb8b8-1856-4471-a281-1666c760d312	PAGE_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 08:12:27.9
90c03f46-4db4-473c-9483-445fe92dd46e	PAGE_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:12:28.943
a64135f5-d86c-4822-b76f-2713c2b743e0	PAGE_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:12:30.562
6353566e-64dc-4765-840e-4bbb73f2dff1	PAGE_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:12:30.999
1a3fc70f-ec69-4016-a88c-65880236fee2	PAGE_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:12:31.998
3fcc3fe7-5239-48a0-bcf3-cbdebedc5b34	PAGE_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 08:18:59.61
af00e758-aec6-452f-a7e1-392a545b5e3a	PAGE_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:19:00.508
b5b28113-8604-4f9b-aaf3-6dc20caf5ca8	PAGE_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:19:01.648
e9ba7ea3-e568-4759-960b-e35000b9b8ce	PAGE_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:19:01.184
d93ec6a2-5e77-499b-919f-1a99b9a21f78	PAGE_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:19:02.752
daa040b0-abac-4ee8-be3e-a16ebb70b096	PAGE_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 08:31:34.233
3786799c-80f3-4d4f-b241-88d154ac0b18	PAGE_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 08:31:34.612
5cd4dd1b-4632-427b-b599-bce3949927e5	PAGE_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 08:31:35.519
67f4adba-8ffe-4320-967b-da875ce74deb	PAGE_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 08:31:35.164
fc5b0891-b011-4a78-a735-3e39cc721566	PAGE_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 08:31:36.374
030f2c22-4ed1-491a-a110-1b81d52077b2	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 12:31:54.74
b875dc23-698c-49e0-953e-44a788ea343f	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 12:33:00.583
226517bb-06c4-4ce1-8219-7c730d955612	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	\N	\N	\N	\N	ar	{"pathname": "/products/hp-victus-15-fa1093dx"}	2026-09-21 12:34:28.88
3ec3bae8-3d06-4c2b-87a7-4f8b3bea9a63	PRODUCT_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:34:30.641
d17ad2fe-3725-472d-9ff5-eb30a76b3b44	ORDER_INTENT	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:34:32.773
f6faf5b8-f19b-4604-b6b9-a1c2157ed13b	ORDER_INTENT	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:34:37.976
fc74ae00-787f-47eb-b89a-232a29864c37	ORDER_INTENT	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:34:46.355
9d72fcfe-b507-43a1-9685-6f8f851ee730	ORDER_SUBMITTED	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:35:04.796
6fa5aa39-8b3f-4b37-be44-8f4fef1f165a	ORDER_INTENT	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:35:10.65
bcf25b3a-9b82-4a41-abdd-e9ca90a19b2e	ORDER_SUBMITTED	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	739a21ac-dd03-48b8-9eb0-ca6a493a4936	88ab96a0-8f5f-4d88-a618-f87449acb861	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-21 12:35:36.655
bc5780fc-86ea-4dc0-a6f9-301809425d2d	PAGE_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 19:34:08.249
f0f0a286-53d5-4bf1-9429-2ea4d1ec2dbf	PAGE_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 19:34:09.624
f7e8f269-79ec-4613-bb04-b4c3bcef3651	PAGE_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 19:34:10.698
6e5e6227-060a-4a08-81f4-baaa31bc13c4	PAGE_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 19:34:11.208
b0f27074-0a7e-4a60-a8c3-cb9e9e72bd1e	PAGE_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 19:34:12.255
98129a5b-c855-484a-b3f8-5d6f92f9ae90	PAGE_VIEW	ed23de44-9213-41e0-a947-8bdaa2060990	c3cd487d-3a34-4fb8-95ec-93b2ae29612f	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 20:04:32.103
fd6c1323-6d33-4185-aceb-3724d3598be7	PAGE_VIEW	ed23de44-9213-41e0-a947-8bdaa2060990	c3cd487d-3a34-4fb8-95ec-93b2ae29612f	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 20:04:32.896
7dc98faa-32f6-4fff-af0e-906364c748f9	PAGE_VIEW	ed23de44-9213-41e0-a947-8bdaa2060990	c3cd487d-3a34-4fb8-95ec-93b2ae29612f	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 20:04:32.356
202a7c29-0438-41a0-8593-18f9348d4994	PAGE_VIEW	ed23de44-9213-41e0-a947-8bdaa2060990	c3cd487d-3a34-4fb8-95ec-93b2ae29612f	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 20:04:33.934
3852b488-8e6e-4a9a-8223-a1be0dc56e1a	PAGE_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-21 20:07:21.438
275f3a0e-5b2b-4dea-950e-082f15bca07d	PAGE_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-21 20:07:21.798
0cbc87c9-7348-41b5-bc35-e336d9b56177	PAGE_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-21 20:07:23
edf3f407-1e11-4a52-8255-31ca34f0ede5	PAGE_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-21 20:07:23.385
d31e9a21-558b-4aa0-90c4-4480e6710bb9	PAGE_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-21 20:07:24.176
1b70ec43-f9f7-47d9-a4ec-96b71b937369	PAGE_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-22 03:10:36.01
c2f42fb0-b654-4cc7-b8ac-05c2e06e8d31	PAGE_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-22 03:10:37.126
54fa3859-d857-4cbb-90e5-2ecf3caee65e	PAGE_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-22 03:10:39.528
103b5aab-7b7e-4376-899d-3f4f74947337	PAGE_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-22 03:10:41.292
f46b3d43-9b65-4758-a37b-6bf40767d8c7	PAGE_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-22 03:10:41.604
d1280aa9-ec3e-4ba7-a138-506862f1aaf7	PRODUCT_VIEW	3616082d-d7b9-4a8a-a83f-846a04d6a6d6	484466f8-4c5f-4575-a07b-a59cedfd756a	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:31:37.834
d93b051c-5e89-49e4-a71d-736537a88948	PRODUCT_VIEW	a83c8b92-b8c6-454f-95f7-00b45fdbdc97	047f6fd3-d525-412f-8f27-7f54c4ff540c	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 19:34:13.651
27bae6ff-5050-49fe-bda0-08b7be1344e8	PRODUCT_VIEW	ed23de44-9213-41e0-a947-8bdaa2060990	c3cd487d-3a34-4fb8-95ec-93b2ae29612f	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 20:04:35.066
6b596a77-ee99-4034-b78e-52ea6e57511f	PRODUCT_VIEW	c438304c-0830-412d-8ced-024eb7f7d7dd	940644a1-905e-4660-8102-daefe6138f00	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 20:07:25.573
cc31c90f-ebd8-4df1-9283-f7d3a89f3b0a	PRODUCT_VIEW	f1d74593-33c3-49b3-87ff-5d3b2c44eb63	3058bbf8-3e54-4171-93f4-76e095ffed43	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-22 03:10:42.334
be087b88-a3b1-4963-9408-2cf8bdf77402	PRODUCT_VIEW	c0d92dee-3454-4f13-b2ce-6fd27dba3182	9559fc17-dce7-4fce-9ba1-e3b0b367d163	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 20:08:08.617
f43fd7f8-7fe9-4305-8b2e-db161afaa8ad	PAGE_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-22 03:25:00.524
f9f3775c-323d-4f65-87db-b8f646a87d94	PAGE_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-22 03:25:00.914
77a7aade-b09e-42f0-a130-cb2f236a93a6	PAGE_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-22 03:25:02.049
75fc8194-d642-425f-a30b-568c77916e56	PAGE_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-22 03:25:03.458
515a1d5b-ad63-421c-aeb8-69543c5c72dc	PAGE_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-22 03:25:05.364
9f550dfb-6176-402b-8d2d-2856fe8f2c17	PAGE_VIEW	83aa7caa-bc0f-4c96-83a8-208d8263def9	afed6858-7280-436f-8231-c9e5e7fef577	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-22 04:22:06.332
1f4d2ced-29b5-4b2b-93ee-f0570b43fa1f	PAGE_VIEW	3ad43ea7-a0aa-4666-98f5-cf17b56f13ae	af4a4bb4-372f-40f5-b208-6d7a2582f2ca	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-22 04:22:07.089
936864e4-8923-4ec5-b5e8-9ba7aa598808	PAGE_VIEW	231a6027-3270-45df-a4f8-c4a47258dc71	f51ef249-682e-4a7e-a32a-2d5641c7f6b5	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-22 04:24:44.12
013e73c4-83fb-40e0-b39d-b77c7c6fb295	PAGE_VIEW	231a6027-3270-45df-a4f8-c4a47258dc71	f51ef249-682e-4a7e-a32a-2d5641c7f6b5	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-22 04:24:45.016
86adefb3-124a-4b5b-b88f-f79e02b793dd	PAGE_VIEW	d11ec70e-9c43-42e1-b438-706a73994fac	7e008ce9-9cfa-495b-bb9b-ac5682acf6f7	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-23 14:59:10.828
39c511d1-8047-4c65-8f8c-b46fbb3fc9f6	PAGE_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 15:24:08.326
8e588b7f-7dd2-4f5f-9c7b-42902b3949f1	PAGE_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-26 15:24:08.525
ba7586c2-0e5f-48c9-a121-6c4aeb80df56	PAGE_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-26 15:24:09.735
e63c3e6e-d49e-4f26-bb73-1d67689e1848	PAGE_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-26 15:24:10.263
50c0d6bd-195f-4eb6-9325-9da5415f2647	PAGE_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-26 15:24:11.166
33447b65-3856-417a-a290-320c608a5d5b	PRODUCT_VIEW	92012bfb-f6f1-4342-b633-487fa549c8fd	02abc4a0-fe24-4322-954a-7dd63c00760e	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-22 03:25:06.451
e7bfddd2-005e-43a5-b034-03b26504f3de	PRODUCT_VIEW	360fc9d3-899b-45df-98d8-9eed6a7ceecc	8977c8dd-0033-482b-90b6-eb806f5d1974	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-26 15:24:12.618
e32c2d19-8507-483b-93e2-96ea418a5f35	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	e92e8392-612c-4603-be34-3a1afe277750	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 16:21:13.315
9a87858d-363e-417d-8e59-e9d14fb80747	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	f1153b1b-1d90-4b8a-b448-a70462f14813	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 17:00:51.565
95c52629-168c-4202-9d65-07d39fb1719f	PAGE_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 22:03:01.564
e77acd6d-068b-4aa2-852d-5c1df5d6a684	PAGE_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-26 22:03:01.976
9364ee51-54b6-4ab1-b63c-33dc94f22638	PAGE_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-26 22:03:02.019
0e76264c-8bc3-4e14-8ce2-a8ae43d96bb2	PAGE_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-26 22:03:02.412
653fa7d8-028a-45d5-9e76-1c09c5e32a3b	PAGE_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-26 22:03:03.455
ba563f3e-44c5-421f-8575-cd1266267cdf	PAGE_VIEW	ef2b7fd4-9cb8-4185-be6f-31ba6d3f9349	b84d45c2-3a7a-410c-aa48-f959065cf8a2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 23:22:42.986
a8b5fe54-312a-4654-b076-efd88edc8763	PAGE_VIEW	b6f49608-52e2-4681-915c-1d8b8943ecca	919505a0-62b7-41bb-9ec9-ceccc16772fd	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 23:22:42.952
23ccaf17-5000-4ce4-a3c7-38046f336ba1	PAGE_VIEW	ba0cc57c-f79b-4983-803e-4b5f45b4aabe	b43b80bc-c080-4700-8d5c-d28f32c9b9a1	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-26 23:22:51.459
880e5cf2-38ce-4636-a40b-1f0aa69b1b3e	PAGE_VIEW	0811a00e-b2e6-4d31-87ab-0c04fe91d0ff	a0a4a4d6-b664-4434-b1aa-e4044e3c1812	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-27 00:16:09.717
1c9e6ffd-394e-408c-bb48-c154eaa214fe	PAGE_VIEW	08664b5f-1ddd-4875-8725-6249dba6d812	392290b0-04d7-42a7-918b-15b5de052ad7	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-27 00:16:09.99
e31f8675-eb59-48f5-be98-228de5e43cda	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-28 08:28:34.924
f7cca196-c597-411d-8536-bf58e5789235	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	fe056501-4baa-40d3-85d0-4b77fae578c2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-28 13:04:50.846
76f2174f-9254-448e-8d09-217c6df30ee0	PAGE_VIEW	60cb177d-f0f0-4844-98d1-bab7302797a9	14cd4729-a35f-4ba4-b8af-78bc409fdc1f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 03:51:17.718
6abfc72a-3c7f-4773-b3fc-398c06a0e9fd	PAGE_VIEW	87c6390d-a99b-4e59-b6c4-471dc5b4fdb0	a766efe8-9fda-4ba2-9adc-62dc5d83a134	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 03:51:18.488
c270b532-fbe1-47c6-a8e0-cb419cbc6c67	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 03:53:46.955
9e559597-d28d-475a-a31b-7bfda554e674	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-29 03:53:52.204
72104950-bd3a-4482-8abb-cea2f980078e	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-29 03:53:56.363
1fb6731d-c2ef-4a7d-9780-ee8e4e2822b4	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products/test"}	2026-09-29 03:54:00.791
f2b1ccf7-011a-4f60-9477-db4688c38f21	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products/test"}	2026-09-29 03:54:46.779
d9a6e6ed-d293-4bdb-8ef4-0e7edb4f8794	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products/test"}	2026-09-29 03:55:17.125
992f8b50-292d-4961-bb66-e8aecd0054bd	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products/test"}	2026-09-29 03:55:41.393
cc6aa9cc-2c67-4d88-afec-4472e48c998c	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 03:59:46.34
a677f163-ff18-46a4-9fd2-624e7936ddc9	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	c8208a76-001e-4fc7-b000-c8d180b5e05a	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 11:54:05.411
bf098f90-0a4e-4b7d-a7b9-6d3f9db68878	PRODUCT_VIEW	a3dd8434-d5b7-41bb-821a-159d242800b0	65885166-bda4-44e4-82fb-809550e1014c	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-26 22:03:04.345
e70d2318-9737-4b8c-b579-10a8d2072128	PRODUCT_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	8a199a86-6e1e-4672-85ad-999580b529ce	\N	\N	ar	\N	2026-09-29 03:54:02.435
bffb1381-6e6f-4df0-ac65-67336b5a9373	PRODUCT_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	8a199a86-6e1e-4672-85ad-999580b529ce	\N	\N	ar	\N	2026-09-29 03:54:47.755
981e53ea-7523-43c7-b39b-3f1a475fa06d	PRODUCT_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	8a199a86-6e1e-4672-85ad-999580b529ce	\N	\N	ar	\N	2026-09-29 03:55:18.204
74a75b8f-aa4f-43d1-9a5c-68f4a508e4d0	PRODUCT_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	8a199a86-6e1e-4672-85ad-999580b529ce	\N	\N	ar	\N	2026-09-29 03:55:42.167
fe74dfc6-e975-431f-8b5e-d7db43aafdaf	PAGE_VIEW	2a7d7ee7-e827-4686-bad7-5c8123ba6b11	d3129d96-0273-43e8-b7aa-b09ebf378e2c	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 19:05:32.78
078934b0-edcb-4530-99b8-df62b3dea804	PAGE_VIEW	61b74076-8a87-4a76-8d88-cfb540e9f39b	6a1fb508-7aa1-43a0-bd5e-2dc4b723aaf2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 19:06:04.184
5a870a44-45ce-4662-a172-6e2ade2f6161	PAGE_VIEW	61b74076-8a87-4a76-8d88-cfb540e9f39b	6a1fb508-7aa1-43a0-bd5e-2dc4b723aaf2	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:06:04.725
ff21ba33-59b7-4d1e-bc01-41d075c9e3d8	PAGE_VIEW	61b74076-8a87-4a76-8d88-cfb540e9f39b	6a1fb508-7aa1-43a0-bd5e-2dc4b723aaf2	\N	\N	\N	\N	en	{"pathname": "/en/products/lenovo-legion-5-16irx9"}	2026-09-29 19:06:07.21
a57c9141-3aa1-4455-8bcc-740bc2820528	PAGE_VIEW	61b74076-8a87-4a76-8d88-cfb540e9f39b	6a1fb508-7aa1-43a0-bd5e-2dc4b723aaf2	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:06:07.928
34737324-f39a-447f-9cef-1ea459d7a09e	PAGE_VIEW	0cd16601-d5bb-450d-9dbc-349e2f8d7386	e02df2a4-6df3-418f-a712-4e878fb96ef3	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 19:06:29.083
c0f98b72-728e-47ae-8155-f5b8e8e053c6	PAGE_VIEW	0cd16601-d5bb-450d-9dbc-349e2f8d7386	e02df2a4-6df3-418f-a712-4e878fb96ef3	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:06:29.36
d0c810c0-5fba-4606-8b8b-a01a4c4870c0	PAGE_VIEW	0cd16601-d5bb-450d-9dbc-349e2f8d7386	e02df2a4-6df3-418f-a712-4e878fb96ef3	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-29 19:06:31.519
1b7cf64a-296f-4302-bc23-c7546e305b68	PAGE_VIEW	0cd16601-d5bb-450d-9dbc-349e2f8d7386	e02df2a4-6df3-418f-a712-4e878fb96ef3	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:06:31.892
cd0a445c-54b2-4998-94a2-b2b6b5f86554	PAGE_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 19:06:58.82
8d09c642-e05b-42bf-97aa-870171f653ff	PAGE_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:07:00.317
9be157cd-6d8c-4697-87aa-0c02789b6fb4	PAGE_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-09-29 19:07:02.388
761bd230-dfde-43df-95e4-bd958c6dbbd5	PAGE_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	\N	\N	\N	en	{"pathname": "/en/products/acer-aspire-5-a515-48m"}	2026-09-29 19:07:04.36
d6cd2e8c-33ea-4805-9b28-b9926944db7b	PAGE_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 19:07:06.442
9de6dbc9-d51b-49ae-94b2-f4fc3aa41b86	PAGE_VIEW	9ca4a287-ea5e-428e-a415-7fc4e708d0f3	0ab3029e-717f-4fc3-8732-c0201dfa8d7a	\N	\N	\N	\N	en	{"pathname": "/en/products/lenovo-legion-5-16irx9"}	2026-09-29 19:45:20.87
210eb142-2af1-43ee-b933-33058eb5223b	PAGE_VIEW	94bf3c8f-2586-493c-9149-6fe9e28e34de	fa559bf3-0283-44c6-b749-12fe8197fb57	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 19:45:41.94
b302096d-107a-4b71-9580-78a91510ef48	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:25:03.212
d413882b-ba2f-4993-9733-cac42bfedd8d	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 20:25:50.667
5046135f-7133-4c5d-9ea2-bea00fb29344	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:25:57.368
9c3e9f34-d7ab-4e2c-9ae2-506c24a2f3e7	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:26:17.937
947b71e5-b24e-4769-ac4e-06a92bf2dcc0	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-09-29 20:26:20.197
e174da9b-e948-469b-891a-1736fbf3fdd0	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	a0ef314c-2bb6-4181-ba60-0f2f566ef1c0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:26:21.471
8f9691d4-3f6d-435d-99ba-c98ab8487620	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	eccdc288-26f2-4a83-9b38-3fc88b706a0d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:26:28.161
2f8b28cc-fd5a-4873-ad94-297a055ec10f	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	eccdc288-26f2-4a83-9b38-3fc88b706a0d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 20:26:31.058
bdf4091b-126f-4f33-8075-ee38fcf03ad1	PAGE_VIEW	1022fcbe-49f6-402e-8963-cce68507cc4e	e131c990-3b1d-41d8-8c86-6616df7c49e4	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 21:17:02.557
5b015c5c-58c8-4e5e-a5a2-2a24edf55a33	PAGE_VIEW	1022fcbe-49f6-402e-8963-cce68507cc4e	e131c990-3b1d-41d8-8c86-6616df7c49e4	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-09-29 21:17:05.696
a861eeef-0e9c-4c99-95e4-0a613d7ab521	PAGE_VIEW	1022fcbe-49f6-402e-8963-cce68507cc4e	e131c990-3b1d-41d8-8c86-6616df7c49e4	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-29 21:17:09.407
d3c6a525-4209-4bc6-a243-41b17a2568d9	PRODUCT_VIEW	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-09 21:22:25.203
142efd08-410a-45bb-8b41-423ec560070e	ORDER_INTENT	0da9e9e6-a0d7-445d-9d38-217de5cb5a6b	cf698dfd-a8e0-4722-b14a-87be07fa437e	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-09-09 21:22:27.312
ab0f489e-9481-4917-9d91-667409a7b847	PRODUCT_VIEW	ef6a6749-26b2-4699-abef-64f0c35e4ddb	7f59c40f-9fe7-4557-bb25-b0ff3c16ab02	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-20 20:37:03.783
5e6ac458-6c47-4585-b5bc-e07b65fa3ab6	PRODUCT_VIEW	4283e326-0508-4dd1-8fd1-5e42b7f307dc	2d5c2fc0-feda-41ae-95bd-396a5ecb7019	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-20 20:39:14.152
a0c475c5-d19a-4c5e-9313-a43dd572c638	PRODUCT_VIEW	2434904e-f624-4ead-90b3-478926bb4e7b	9630c56e-9d0b-4bad-9417-ed75c1f3e20d	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-20 20:41:40.888
f4d67dbb-fe25-4112-9897-8c9175a7b73e	PRODUCT_VIEW	12cb1d38-2ce2-4109-bbf9-29cad92dab71	75c9ca0b-ecd3-4045-8c2b-7d8bbe835bb4	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-20 20:54:20.521
16c12b2f-89da-4272-a079-2437455cfa4a	PRODUCT_VIEW	af62679f-23ca-4653-b849-451c70a2910b	842d94d8-ea71-4168-8214-ad9d51319581	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 06:22:14.383
2f46d71f-5654-40f0-9363-87e0d88e9733	PRODUCT_VIEW	f559c176-a22a-428c-94d0-89b0bdd6da77	91de9024-2b1b-40e7-bccb-7965b69bf643	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 06:22:59.403
bc90d257-728f-4e98-90c6-cc5b8d353d59	PRODUCT_VIEW	011bccca-987f-47bf-aed6-994a025b8c88	ea272930-031c-4978-801e-c152af1b9483	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 07:47:04.708
50f7f8a2-1565-4b9e-94db-dc699dcd270e	PRODUCT_VIEW	40ced0b2-f9af-4ca4-8888-3043df2dc482	c12dc876-0787-4f89-9792-20da8d0958f8	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 07:48:47.726
90aca0c0-7f75-4e62-8cbc-12467823126f	PRODUCT_VIEW	1a07bc21-4726-48c3-8579-24dcc71d6a0c	ca8c4c70-1ef8-4234-9b97-168ed2893a7d	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 07:50:11.804
7f1a88e0-0a94-4e15-be72-67f66d7d2729	PRODUCT_VIEW	303bf732-1df3-4337-8ea3-1201da28070e	7ff56e4f-9bef-4a7b-8e1b-771622a306c4	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:01:40.863
2da6af1b-394d-46d1-a50a-0a1db9a9619b	PRODUCT_VIEW	bec48207-e761-471f-acd5-465d84cd6634	d95bb333-f96d-47d9-89c9-8eec55af3f0f	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:03:00.128
aaf0d394-a4f9-440f-b384-84372d79a50e	PRODUCT_VIEW	8f9475c5-3e68-4fe1-ab6f-fcf96eb459c6	d7aec218-5a28-42b6-a3d7-660d2fad8f82	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:06:13.057
047cc055-6833-41db-8e1e-adadca388196	PRODUCT_VIEW	d16d5106-1d9a-445a-ae41-27385f89124d	3471a3a0-0078-4e56-a343-2cf24b04fee6	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:12:33.3
0e6382f6-0e91-4072-8c38-643eb3154c4a	PRODUCT_VIEW	bead9e40-c683-4695-92e8-3c8ec94b49a8	59e8ec51-7c02-4b2c-b4d3-213c66c4aefb	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-21 08:19:03.644
55b6ac95-7fbe-4f10-b47a-8ccab06ea0ba	PRODUCT_VIEW	e8ed9243-d411-4bfc-8f52-5ef3e4f8b73e	6ec17069-de7b-4e08-ab35-f1f278c3ed28	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-09-29 19:07:05.329
abe6e722-22c0-4535-bf2d-f73446e1641f	PAGE_VIEW	1022fcbe-49f6-402e-8963-cce68507cc4e	e131c990-3b1d-41d8-8c86-6616df7c49e4	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-09-29 21:27:40.533
22cbed5e-b582-4b69-8cd0-4c4668a83fa2	PAGE_VIEW	0c166f43-d62d-425e-9007-38f36101b9ae	977291d0-d1d8-4ed0-8dd1-8ce921c5dfa5	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-01 11:50:26.746
5c9b325d-8086-4115-9e51-f9e62940726c	PAGE_VIEW	cfe466a7-9a1c-4f90-9242-00882230f6fd	e6f93342-53af-4c3b-b9df-b2eb5401c900	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-01 11:50:26.801
58ad7066-6da3-47c4-8ecd-4f7c77b619a8	PAGE_VIEW	ef6de70e-4f1e-4398-b0b9-f3b440a7fa7a	9dc3c90b-d88c-4698-8ae8-510d4e0d5de2	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-01 13:29:34.226
f79a30ee-7979-470e-aed1-93c646c06068	PAGE_VIEW	1a2c6ec4-f822-40ce-950a-acb9f81a5e76	151cb9ae-7c4f-4cfd-b242-42d572daa451	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-03 20:30:45.84
78b14201-445c-4137-929f-b472ef8666bf	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-03 20:30:46.182
be164111-4adc-4b68-a0ab-889bd45a0649	CONTACT_CLICK	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	WHATSAPP	HOME_CTA	ar	\N	2026-10-03 20:30:48.241
7d00f228-1a91-41c0-bbc4-38d793bed347	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/dell-g15-5530"}	2026-10-03 20:31:07.766
9c0b83ae-7393-43ad-aaa8-a818bce56177	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	53a3471d-7dce-49f4-b97d-7e7390eb2a9f	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:31:09.075
06bb0970-bab4-4f02-bf06-cdf9062d33aa	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/msi-modern-14-c7m"}	2026-10-03 20:31:28.987
08c7e49e-de4e-4787-8cc4-2ad3fc576a2b	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:31:30.53
fd304e02-2bc3-4474-a377-09b3f8326cfe	ORDER_INTENT	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:31:38.912
3d9a2685-ffa3-43d1-8cd4-b6489499abb7	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/msi-modern-14-c7m"}	2026-10-03 20:31:48.365
4d3c85f1-665e-4466-b68a-1291b062973c	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:31:50.657
f41b33fa-1970-40c5-aa91-e2fcab1a03a5	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/dell-g15-5530"}	2026-10-03 20:31:52.925
f4a82cb7-0050-4f44-b9f7-1528499744fe	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-03 20:31:53.617
c3264b2b-4ee7-48ad-a525-df3e7b392f58	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-03 20:32:03.276
36c3f593-ffad-405c-a87a-a62fee8b931c	CONTACT_CLICK	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	WHATSAPP	HOME_CTA	ar	\N	2026-10-03 20:32:07.744
a7205987-ce0e-463d-98a4-5430591a62fa	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:37:50.085
3ae36d00-dc8a-4bb7-b706-8a413600834e	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:38:42.612
eb3fefcb-b51d-40a9-af0b-534f0898c5c4	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:38:42.655
f9dfd290-14af-4c98-8351-9057917ee4c3	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:40:09.892
68ccca60-cb53-4db9-ab26-12fd32d4ebb4	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:40:09.9
80fc20d9-245e-4468-92af-3aaf61f2ade3	ORDER_SUBMITTED	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:40:17.714
141c0787-e4c8-4515-ab4e-a7757a0fdca8	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:40:34.63
9cd5bbc1-0cdb-43a1-95d9-adeea8172024	CONTACT_CLICK	11111111-1111-4111-8111-111111111111	22222222-2222-4222-8222-222222222222	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	WHATSAPP	PRODUCT_PAGE	ar	\N	2026-08-26 08:41:28.794
e13d0a58-c1f9-43c8-8ba6-1b8678b39b6d	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-08-26 08:42:02.259
97c777e9-6533-413c-b907-c369bd09b56a	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-08-26 08:42:02.303
f6fd6c61-f41d-4394-adc2-ea1b2ce75f40	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:42:04.293
6ed72ece-4cb3-4b46-b331-90bb8289603c	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:42:04.29
b7ec86a9-a489-4b10-b717-bb3bb9fd76da	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-08-26 08:42:21.957
4d5f7376-f9e3-46cd-ab6d-898217500b2d	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:43:33.764
78475382-b720-4364-8ea0-debdcabe124a	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	53124992-2cfb-4707-8608-cfdbb4d3cc17	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-08-26 08:43:33.76
e0fc1886-c828-4f8d-950b-d78593e5af52	PRODUCT_VIEW	46063903-4bf0-4081-ab11-98f79cca0fdf	6b666010-557e-4ca0-b900-ebac062dc6e8	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-08-26 08:45:41.844
aea3b10d-6d79-464f-b6e8-6945e4e2b169	ORDER_INTENT	46063903-4bf0-4081-ab11-98f79cca0fdf	6b666010-557e-4ca0-b900-ebac062dc6e8	\N	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	en	\N	2026-08-26 08:45:47.858
8e03f53a-660e-4b5d-96ad-2fd7d5213522	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-03 20:39:04.563
73f14c5c-0f1a-4ae1-b506-df5bec1799f8	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:39:15.271
3eda3484-d01d-44ea-bcdc-5a841adf41dd	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:39:26.327
5af8bf97-6af4-4734-b6de-c3a83d90365c	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:39:33.138
eb4d5f5e-ce4b-42e8-ad64-14e3179ca4c5	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:40:19.156
a674c225-1373-4f7c-a379-0c7d986cdbe7	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:41:26.132
220805fb-769d-428f-81a3-7b5d7b9b7031	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-03 20:41:33.731
8b7b9f47-c659-4a04-b8ba-b9fd65de8942	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:41:35.216
260db048-ecaa-4d31-bf7f-ca98cc23a5d8	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-03 20:41:49.351
89233244-6fad-4256-8c76-54a304f8bba7	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-03 20:44:50.39
12e582ff-5aca-433d-8158-54f2877e1476	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3d169f48-8ee3-4734-8d67-51039471d47d	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-03 20:44:51.883
99b1ac23-a0fe-4bde-9db5-93aa9e95c88b	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 07:21:53.019
555cd6a4-a4f6-45c5-a708-4e5385905de6	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	708b6aa4-7e8b-4c72-8cb7-1b0d22385865	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-05 10:51:44.204
541bfec5-09e1-42d1-9f64-906033b73a94	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	708b6aa4-7e8b-4c72-8cb7-1b0d22385865	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-05 10:51:46.737
a45ea770-3371-4a7a-89a3-b184bb2da5ba	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 13:29:23.803
b99008f6-477c-4a57-a536-da84dbd224b5	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 14:32:27.502
569d2e5e-6b16-47b3-8d85-5f33996d6766	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-05 14:32:34.58
198967ab-4fc5-4ce4-8ce7-b72f8a6b6374	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-05 14:32:41.371
c1508d87-e3b3-46bb-9afd-4a08af6c23da	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-05 14:32:41.737
ebc17ae4-5e20-4dd9-87f4-31cdf31cfdbb	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-05 14:32:56.549
1aa50873-5955-4c55-9bd7-7c57d6854c7f	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-05 14:32:58.39
5c02c1f9-c38d-4a8e-9782-f5359922bb6e	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	11b73dff-2482-4b8a-a6be-e7c27e9a8069	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 14:33:01.008
bc21962e-2d80-4628-b458-c894dce9189e	PAGE_VIEW	c352a881-fbe3-405d-ba74-64fbb08fdfa3	695b41e2-8dc8-4811-a3a9-792bd5e583df	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 14:45:46.028
538316ea-6cae-4f8a-a613-b6e94129171a	PAGE_VIEW	c352a881-fbe3-405d-ba74-64fbb08fdfa3	695b41e2-8dc8-4811-a3a9-792bd5e583df	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 15:09:00.085
74c75641-0504-4bf3-85b7-5ebbe8eef8c4	PAGE_VIEW	a2737704-0cd6-4225-9f05-2cb068970c92	6ea14ffa-0c52-46bc-b51d-539f5fb2dafd	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:15:21.175
9acda8af-8261-4953-aa70-907862af646a	PAGE_VIEW	d9c90258-1570-4c95-9cfd-c7c7ee4227bf	1f02dbb0-a7d4-4e8f-9608-b46176773988	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:15:21.135
98804d86-1c51-47d9-b0e0-0145f52bc142	PAGE_VIEW	f1af2320-fd56-436b-9c6f-385f32d831e5	42bb61b8-45ba-4630-a3af-94803726b407	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:15:58.332
65ccee93-1a20-4c97-bf14-51a8f0b40654	PAGE_VIEW	0d5b412b-a25f-42b9-b3a9-5321a146896e	2b30d7aa-7d47-42ee-acba-3d129ab12edf	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:15:58.614
e6d4f4bb-f4ff-453c-85f6-bf24caad2f4f	PAGE_VIEW	c352a881-fbe3-405d-ba74-64fbb08fdfa3	b688e2bb-7a5f-45e0-a6ea-e97aeec7a535	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:18:10.093
35c29513-bed7-4644-bf8e-4112e2627dbe	PAGE_VIEW	c352a881-fbe3-405d-ba74-64fbb08fdfa3	b688e2bb-7a5f-45e0-a6ea-e97aeec7a535	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-05 17:36:40.96
310bae36-ac65-4e5b-8286-24d5e4eebca4	PAGE_VIEW	5da3918e-154f-44c5-9bbd-706edba0e612	20ade25e-3d18-4328-8206-1c6816f4e382	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-06 07:54:07.66
8c492233-f425-42d4-8322-9ea2425dc54b	PAGE_VIEW	e76a6258-1913-4e1c-a089-839c363a1afc	73ab5016-dd02-4f0e-b8e3-14439b3d767f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-06 07:54:07.754
cf7cd92a-9359-45fa-8c77-8b06d7fe6b21	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-06 08:58:21.502
f19fb7fa-88e5-4c5e-89e8-b1c50350372a	PAGE_VIEW	8ea5cd14-f3b9-4546-a78d-4b8d07926338	19b42a41-59be-484a-b2a6-b8af7d56f2a1	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-06 09:00:00.108
464de634-e9f8-45a7-9327-f6bcab76aa0a	PAGE_VIEW	d33e718a-1cae-48a0-a931-5847162ce6ad	d63009fe-3132-4bd7-845d-67d96c20ca49	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 18:06:59.701
a9e13826-bffd-4f2f-aca9-9e7af17093e6	PAGE_VIEW	e3fd172c-a834-4466-997f-6c7495d10147	9c7b5d7e-756f-42ec-a36b-56ef70b8b7ec	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 18:07:04.084
affcdd5c-c930-4e62-94fb-63651a807305	PAGE_VIEW	d33e718a-1cae-48a0-a931-5847162ce6ad	d63009fe-3132-4bd7-845d-67d96c20ca49	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:20:27.276
bf7d4af1-cf17-4b9b-8df8-40bc9690bc4f	PAGE_VIEW	d33e718a-1cae-48a0-a931-5847162ce6ad	d63009fe-3132-4bd7-845d-67d96c20ca49	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:28:47.021
c0fe1e63-b0f8-4a85-80c9-4fe66011569b	PAGE_VIEW	d33e718a-1cae-48a0-a931-5847162ce6ad	d63009fe-3132-4bd7-845d-67d96c20ca49	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:33:23.249
d8a7a007-ddd5-40a2-9d34-01e10867c12b	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:34:46.679
c364a080-c60f-46ad-bbab-48684ba785b9	PAGE_VIEW	e3fd172c-a834-4466-997f-6c7495d10147	23034726-53bf-4077-95da-9d32336c48ed	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:34:58.311
a48e1067-ab8e-45cb-9dfa-e55a7f8a7d75	PAGE_VIEW	b29c7b6b-e250-4bbd-8c3e-4f2e28018998	1c5a75f1-43c2-46d6-8b5d-ec83b189904a	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:42:58.971
28bc224b-0954-4ec8-ba47-5219176f4790	PAGE_VIEW	b29c7b6b-e250-4bbd-8c3e-4f2e28018998	1c5a75f1-43c2-46d6-8b5d-ec83b189904a	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-09 21:43:10.57
4b1fc9fe-1021-49a7-95fe-f0e791be06b4	PAGE_VIEW	ca9d394a-feb9-4357-9236-fe2cb0440165	eecfe6b9-2096-4aca-88ac-a030a498d131	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:43:49.76
3b15a2d0-700b-4d3b-b4ad-43dbe2a4ba7f	PAGE_VIEW	ca9d394a-feb9-4357-9236-fe2cb0440165	eecfe6b9-2096-4aca-88ac-a030a498d131	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-09 21:43:56.144
974fd8d2-b031-42fd-9884-8c4598320d4e	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	6e4fb7d3-5868-4419-9125-85692cf5f6ce	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:44:53.612
1c393b07-71c2-4a81-a5b9-ae85cef14e0b	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	6e4fb7d3-5868-4419-9125-85692cf5f6ce	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:44:55.738
700cbe11-d1d9-45bc-b4ea-f5b2920cd211	CONTACT_CLICK	08f43736-c86b-4364-8585-8d35e9112f19	6e4fb7d3-5868-4419-9125-85692cf5f6ce	\N	\N	WHATSAPP	HOME_CTA	ar	\N	2026-10-10 09:45:10.923
1c8413f1-e999-45f6-a4ce-1daa90d36b3b	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	6e4fb7d3-5868-4419-9125-85692cf5f6ce	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:45:15.852
24e253bc-f333-46e7-8199-a8bda768d18a	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	6e4fb7d3-5868-4419-9125-85692cf5f6ce	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:45:21.304
9e812043-0b61-4bdb-b53d-7d40ed6b7de8	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	557e7429-2c83-4259-9b28-20b462afe6ff	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:45:42.98
c135d388-cd0b-4593-ab45-7d22f8f51577	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	557e7429-2c83-4259-9b28-20b462afe6ff	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:45:54.385
bc06f526-abba-4114-a3fb-9431f5fcde62	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	557e7429-2c83-4259-9b28-20b462afe6ff	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:45:57.066
4ca4b009-f682-4e63-b7fe-3186e97c5702	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	557e7429-2c83-4259-9b28-20b462afe6ff	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:46:00.271
b4afd235-6ffd-4311-9ccd-4bfdd6e6ffb3	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	557e7429-2c83-4259-9b28-20b462afe6ff	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:46:00.932
46c2b742-27f8-47b7-bb57-53a7f5d15853	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	a644e3af-7911-48ae-a76b-20f70150c530	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:46:26.305
d0b928cf-d725-4560-8da7-64697319ea97	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:47:42.474
014368ae-e761-4134-bd34-a0e9624e864b	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	605ba8a0-6989-43e5-a097-9bcd55ee2a1d	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:48:51.405
b8e657b7-e247-423d-a77f-ac9f90defbb4	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:52:39.46
76112dd2-c9d3-4a52-9e4b-743de4dd5cfe	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:53:00.421
fd9d91b1-2053-4aa4-9482-c470fb1de601	PAGE_VIEW	0d8215a5-b714-4e47-9536-82118ec37899	ad268aa5-f25f-4a43-b624-588958ff7eb3	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:55:16.229
3ea7b4ba-67e0-4ee6-8ccc-5d41fad10b86	PAGE_VIEW	abf9d51d-39eb-4bb8-8645-3ba9b71c76c2	e807f015-cbd2-45be-9267-f3a417334714	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:55:16.87
b66ca6f1-83c5-423e-ab42-e7ce0a752118	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	1c39442f-e3c0-4039-a80d-0ba97e2d8ca0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:55:44.114
ed32eee3-b392-4b89-a667-1bdf89c319b5	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	1c39442f-e3c0-4039-a80d-0ba97e2d8ca0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:55:45.125
a26171a0-6835-4ec8-8436-01c497a5477d	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	1c39442f-e3c0-4039-a80d-0ba97e2d8ca0	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:55:52.102
c3ff321b-440e-4dfe-965e-87cc0862e0d6	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	8519ca06-370e-4ed3-bd1e-c17d127fff7d	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-10 09:55:59.641
ae9a4fae-6641-47cb-a116-247b8fa30926	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	2ee27599-f226-4a6f-8a35-70eef313b9c5	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:56:04.455
ee572a26-b9b4-48c7-b66e-c91d7fab8ad5	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:56:53.992
5ef6ad83-767a-4b24-a6e3-3ab74745ddfe	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:57:02.995
7bb7550c-b1c2-48b6-b85d-1e494c49b097	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-10 09:57:17.57
e3be802b-6c82-4acd-b650-9ccbf0152abe	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-10 09:57:19.419
5fc615d0-a0a9-493b-8590-ab7089991a58	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-10-10 09:57:49.322
2a82b892-bf7e-428e-9c8c-c67f554c41c9	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-10-10 09:57:51.248
631c6e13-389e-4de3-b499-8ac196a578df	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:57:56.615
e5d67ece-59ff-4180-9b57-15c4b462aa93	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:57:59.051
23df793b-5a6c-470f-af93-e14676b1a271	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:57:59.775
fa04cd8a-fcef-4bf9-abc6-1fee2285df0a	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:00.529
b9f95f40-1c04-4c53-9940-7d7c7000979f	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-10-10 09:58:05.466
6f27757f-94a9-406d-8d2c-28593f934e51	PAGE_VIEW	1676e704-07f4-4074-8185-dbd58004a92b	2586c6c9-c8b8-431c-bfd8-a286bf64cf05	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:25.343
741abeff-457c-4f61-9373-037087b7de10	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	en	{"pathname": "/en"}	2026-10-10 09:58:36.83
9a019f43-49c5-4b47-b097-3f1bb0de88fb	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:37.533
a813964b-05a8-4e4a-bc53-3f0a2e8f7c5c	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:38.795
710311ca-13e0-418c-8ea0-35525f66df2f	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:39.849
45876ca8-272b-4863-bf8f-aca4c086be93	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:41.172
d5ccc0b4-9862-474d-aa38-70f39ba72e03	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 09:58:48.566
d4c17a41-c67b-44b4-bb49-caa95a5e8b9f	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:58:51.086
5edb8954-d5a6-4988-9858-7d74c0aaeef0	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-10-10 10:01:10.804
6784c6ac-eed3-403d-b37d-d10ca8d19c91	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 09:57:40.445
14b92fd9-90ef-4fe0-b831-4f4fcc9ab32b	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	ee821e37-9d71-4770-8b20-d8e07e83ca3f	\N	\N	\N	\N	en	{"pathname": "/en/products"}	2026-10-10 09:57:46.145
31378177-5d87-4509-a854-f989a643bf45	PAGE_VIEW	4bb51190-6dc4-4931-9cf5-98fa0b01b16b	432c9ab0-d874-42da-9f9f-3a0f996b6844	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 10:01:15.212
b60e3d4b-5afe-481d-94d3-9bdca63f2e6c	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	387e883d-ee8f-46a9-b0e8-751e05dac7d3	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 10:35:14.097
497acb43-1afb-40ac-93c7-6a1aff4291ad	PAGE_VIEW	53ff0f9e-cd19-499f-bc13-553096fc8a34	387e883d-ee8f-46a9-b0e8-751e05dac7d3	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 10:35:43.274
0acd73c8-60cd-4312-a710-50a596da4f31	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 20:49:21.532
f2e71bc8-4ffc-4211-82c5-7d64f7789b20	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 20:49:31.041
0d9aa30a-d6f6-4e8b-9024-2605b0d59636	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 20:49:32.322
31d84d01-6677-4133-942c-7acd51c9c63c	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 20:49:43.15
d7baa9f2-3b27-4df8-8547-e1394c70ffff	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	\N	\N	\N	\N	ar	{"pathname": "/products/asus-vivobook"}	2026-10-10 20:49:51.195
2ba38c81-2f5d-4d52-a4de-0b58170273a6	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3929e07c-8efb-410d-b5c2-bdabc2552929	93fc71ff-c836-4d8e-94a8-49809f82504c	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-10 20:49:52.301
51f9292e-b9bc-4a72-a89c-f3a4f3393375	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	5443e674-4a6f-4f22-a066-e8082f64ee4b	\N	\N	\N	\N	ar	{"pathname": "/products"}	2026-10-10 20:50:00.216
e886ca14-aa05-48a7-8f16-747a902487fb	PAGE_VIEW	1022fcbe-49f6-402e-8963-cce68507cc4e	6a2aa1b9-75ed-4d9a-a7ec-72beeec270ed	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 20:56:09.689
38d672d2-878d-4c7e-9ff5-e148ea24867d	PAGE_VIEW	595f6898-2112-40a9-99b1-8351d74bc780	259cc605-d933-4245-b478-8d27c08b6ebb	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-10 20:56:15.307
59d8fb31-bc29-460b-b0a9-314319c40148	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3755dbbf-6031-4694-8fa0-4c6868768eea	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-11 06:45:38.515
b1815419-871f-435a-9b00-64518c26cee9	PAGE_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3755dbbf-6031-4694-8fa0-4c6868768eea	\N	\N	\N	\N	ar	{"pathname": "/products/testsetse"}	2026-10-11 06:45:51.363
2d67f472-96d0-474b-ad62-9402cedd16e5	PRODUCT_VIEW	08f43736-c86b-4364-8585-8d35e9112f19	3755dbbf-6031-4694-8fa0-4c6868768eea	a7fbb77c-25c8-43c1-a0d1-b86eee104946	3d5d1f44-76bd-4f6d-b03a-8c4138553046	\N	\N	ar	\N	2026-10-11 06:45:53.245
f5918536-5e82-4fe7-aaf4-d19bb31b87ca	CONTACT_CLICK	08f43736-c86b-4364-8585-8d35e9112f19	3755dbbf-6031-4694-8fa0-4c6868768eea	a7fbb77c-25c8-43c1-a0d1-b86eee104946	3d5d1f44-76bd-4f6d-b03a-8c4138553046	WHATSAPP	PRODUCT_PAGE	ar	\N	2026-10-11 06:46:18.16
96b3bf3d-2add-4ef5-a3c1-186aef52e9ae	PAGE_VIEW	ba0cc57c-f79b-4983-803e-4b5f45b4aabe	4812bc78-ac03-41af-923f-5edfb614897c	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-12 07:05:48.527
7b065390-db2b-4954-8b39-85b9a081ac5f	PAGE_VIEW	f699878a-05ea-4834-ba2b-c2e0e483d9ca	648657e1-39e2-4af5-a5ec-6997cc308472	\N	\N	\N	\N	ar	{"pathname": "/"}	2026-10-13 02:41:22.766
\.


--
-- Data for Name: LaptopSpecs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LaptopSpecs" ("productId", "cpuBrand", "cpuModel", "cpuGeneration", "ramGB", "gpuBrand", "gpuModel", "screenSize", resolution) FROM stdin;
444e2cee-2cb4-4759-b6d0-f30b4772e16d	Intel	Core i5-1335U	13th Gen	8	\N	\N	15.6	1920x1080
88ab96a0-8f5f-4d88-a618-f87449acb861	Intel	Core i5-13420H	13th Gen	16	NVIDIA	GeForce RTX 3050	15.6	1920x1080
6d4c16f8-4b34-4d57-80c8-81e8f8bc4421	Intel	Core i7-1355U	13th Gen	16	\N	\N	15.6	1920x1080
53a3471d-7dce-49f4-b97d-7e7390eb2a9f	Intel	Core i7-13650HX	13th Gen	16	NVIDIA	GeForce RTX 4060	15.6	1920x1080
fb451a60-610e-4d91-b1e9-254ea8032bdb	Intel	Core i5-1145G7	11th Gen	16	\N	\N	14.0	1920x1080
44ba4635-c1e4-4cdb-93c0-508709be0922	Intel	Core i5-13420H	13th Gen	16	NVIDIA	GeForce RTX 4050	15.6	1920x1080
771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	AMD	Ryzen 5 7530U	Ryzen 7000 Series	8	\N	\N	14.0	1920x1080
93fc71ff-c836-4d8e-94a8-49809f82504c	Intel	Core i7 - 13620H	13th	16	Intel	UHD Graghic	15.6	FHD
a7fbb77c-25c8-43c1-a0d1-b86eee104946	test	test2	\N	32	\N	\N	\N	\N
\.


--
-- Data for Name: LaptopStorage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LaptopStorage" (id, "productId", type, "capacityGB", "sortOrder") FROM stdin;
774f4316-287f-f4f5-e423-767ad79609cc	444e2cee-2cb4-4759-b6d0-f30b4772e16d	NVME_SSD	512	0
ad54b6ac-b05a-a786-e1f3-4abfeae34920	88ab96a0-8f5f-4d88-a618-f87449acb861	NVME_SSD	512	0
00ebb1ef-7953-7b54-4794-767563847da6	6d4c16f8-4b34-4d57-80c8-81e8f8bc4421	NVME_SSD	512	0
314964cc-a57a-77b6-604f-d2192e25d119	53a3471d-7dce-49f4-b97d-7e7390eb2a9f	NVME_SSD	1024	0
23789ff5-fe5c-1904-b89f-9b1c7152a450	fb451a60-610e-4d91-b1e9-254ea8032bdb	NVME_SSD	256	0
62aeacbb-5680-4fd0-4d5d-62579f7c9f1e	44ba4635-c1e4-4cdb-93c0-508709be0922	NVME_SSD	512	0
88e2232d-612c-1f80-aced-aa30c95966bb	771b7b1e-e4f9-4a8a-a8dd-ce6d5a3e38b3	NVME_SSD	512	0
2888f994-aaab-2420-89e1-22355948372d	93fc71ff-c836-4d8e-94a8-49809f82504c	NVME_SSD	512	0
03b6e68b-83c3-4b31-b6cb-b05dd8138a5b	a7fbb77c-25c8-43c1-a0d1-b86eee104946	NVME_SSD	3123	0
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "customerName", "customerPhone", city, note, "productId", "productNameSnapshot", "usdPriceCentsSnapshot", "usdRateSnapshot", "sypPriceSnapshot", status, "createdAt", "updatedAt", "contactedAt", "confirmedAt", "completedAt", "cancelledAt") FROM stdin;
a6204126-cabf-45c8-8b6d-73a39f6855f9	test33	3123123123124123123	test	test	88ab96a0-8f5f-4d88-a618-f87449acb861	HP Victus 15-fa1093dx	89900	12500	11237500	COMPLETED	2026-09-21 12:35:36.561	2026-09-29 21:28:36.575	\N	\N	2026-09-29 21:28:36.571	\N
2db6d7a5-e47a-40c9-a5bd-76dc95d788a8	اختبار ضمان الجودة	+0000000000	اختبار	Task 07 controlled QA	\N	Lenovo Legion 5 16IRX9	139999	12500	17499875	CANCELLED	2026-08-26 08:40:17.622	2026-10-10 20:58:44.341	\N	\N	\N	2026-10-10 20:58:44.334
611fdc71-289d-4b64-82a2-5809d1186637	test	21321312	test	test	88ab96a0-8f5f-4d88-a618-f87449acb861	HP Victus 15-fa1093dx	89900	12500	11237500	CONTACTED	2026-09-21 12:35:04.698	2026-10-12 07:09:42.757	2026-10-12 07:09:42.753	\N	\N	2026-10-10 20:56:26.771
\.


--
-- Data for Name: ProductImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ProductImage" (id, "productId", "publicId", url, "altAr", "altEn", "sortOrder", "createdAt") FROM stdin;
27275c6a-ece2-431d-9aab-eef44a3b1a98	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/utupjixufnkjr57u9mmu	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212340/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/utupjixufnkjr57u9mmu.png	\N	\N	1	2026-10-05 14:59:02.912
c9b1ef47-e306-4263-b43c-b7c714065ed7	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/qqltcymxnzcp3qrfefha	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791060005/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/qqltcymxnzcp3qrfefha.jpg	\N	\N	2	2026-10-03 20:40:08.105
ca062b1b-83ff-4b54-bd26-236824f5c679	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/gzplnroqpsir37r9ursn	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212344/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/gzplnroqpsir37r9ursn.png	\N	\N	3	2026-10-05 14:59:05.767
3aa4d619-00da-44fc-b12c-bb19fc01834b	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/p8m7uher84l5d7hnljx2	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212347/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/p8m7uher84l5d7hnljx2.png	\N	\N	4	2026-10-05 14:59:08.36
332e780b-eca0-40d3-910c-d075616dec7b	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/j9u2hieb3s2d3p0upj1d	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212786/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/j9u2hieb3s2d3p0upj1d.png	\N	\N	5	2026-10-05 15:06:29.24
16ddff75-9f86-41bf-b967-5c2afb6ee760	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/ytefuzf4d8nxsdxsufis	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212790/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/ytefuzf4d8nxsdxsufis.png	\N	\N	6	2026-10-05 15:06:32.949
f9bb791b-e968-4764-bf19-7b99f7d014b5	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/oaz9n8jviftsuugp1pd8	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212794/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/oaz9n8jviftsuugp1pd8.png	\N	\N	7	2026-10-05 15:06:36.113
4ca8acc9-ea74-4f76-85f7-d3e46646ccd1	93fc71ff-c836-4d8e-94a8-49809f82504c	code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/q4r9ghbhsnfzue1tvuir	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791212335/code-flex/products/93fc71ff-c836-4d8e-94a8-49809f82504c/q4r9ghbhsnfzue1tvuir.png	\N	\N	0	2026-10-05 14:58:59.256
7bd5ef62-d950-432b-856b-4d587eb736ed	a7fbb77c-25c8-43c1-a0d1-b86eee104946	code-flex/products/a7fbb77c-25c8-43c1-a0d1-b86eee104946/qxtzs5qzjcywgvchokvu	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791551151/code-flex/products/a7fbb77c-25c8-43c1-a0d1-b86eee104946/qxtzs5qzjcywgvchokvu.png	\N	\N	0	2026-10-09 13:05:53.205
36e0883b-9ebe-4851-987e-25731e3c4cf7	a7fbb77c-25c8-43c1-a0d1-b86eee104946	code-flex/products/a7fbb77c-25c8-43c1-a0d1-b86eee104946/rmuondn4zwoeq885vxgu	https://res.cloudinary.com/qcvbwtnd/image/upload/v1791581746/code-flex/products/a7fbb77c-25c8-43c1-a0d1-b86eee104946/rmuondn4zwoeq885vxgu.png	\N	\N	1	2026-10-09 21:35:49.694
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SiteSettings" (id, "storeName", "usdToSypRate", whatsapp, phone, facebook, instagram, "heroEnabled", "heroTitleAr", "heroTitleEn", "heroSubtitleAr", "heroSubtitleEn", "heroImageUrl", "createdAt", "updatedAt", "heroImagePublicId") FROM stdin;
00000000-0000-4000-8000-000000000001	Code Flex	13850	+963 943310033	+963 943310033	https://www.facebook.com/share/1Q4Qf7Kmzc/	https://www.instagram.com/codeflex_laptop?stkn=MzlmdDlydGs0NHI1	t	تقنيتك تبدأ من هنا	Your technology starts here	اكتشف لابتوبات وإكسسوارات مختارة تناسب احتياجاتك.	Discover selected laptops and accessories for your needs.	\N	2026-08-14 18:09:13.013	2026-10-03 20:29:04.928	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (id, name, email, "emailVerified", image, "createdAt", "updatedAt") FROM stdin;
N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape	Code Flex Admin	admin1@example.com	f	\N	2026-08-30 03:48:58.657	2026-08-30 03:48:58.657
OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe	Code Flex Admin	admin2@example.com	f	\N	2026-08-30 03:49:26.242	2026-08-30 03:49:26.242
\.


--
-- Data for Name: account; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.account (id, issuer, "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", scope, password, "createdAt", "updatedAt") FROM stdin;
YobIRlFD9VmWiSf8r90ItPSAWT3UBfum	local:credential	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape	credential	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape	\N	\N	\N	\N	\N	\N	9c6160fc136fcff4b20b2f4437477559:6de9954034f49453f14f6e039002b94b3b96429547959343f23f3f25480a68fbc0059cbadb7b92f4dd75555a6c5c35189335f2365fe7f94010ba3758146ea746	2026-08-30 03:48:58.801	2026-08-30 03:48:58.801
21tyYxQpHjVoEn2Ak6mxCcDuvqTN7Rkj	local:credential	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe	credential	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe	\N	\N	\N	\N	\N	\N	ecf5c5c8d9035e7cacbccd980ccb0788:c187b293bfbe986c3904f00c18040cf7b9cd0478d0a950766414498c7f8247931209249eb3a35a625db76c2ab365b9837293be087645d19764c2cb39e2168d90	2026-08-30 03:49:26.392	2026-08-30 03:53:30.674
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.session (id, "expiresAt", token, "createdAt", "updatedAt", "ipAddress", "userAgent", "userId") FROM stdin;
9N8WTbjchhtxchOi8Y8OCVv7ls7wyk5Z	2026-09-06 03:48:58.95	87MCqSGJqQqZMBt7i5XVF9FE8oTORNuw	2026-08-30 03:48:58.95	2026-08-30 03:48:58.95			N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
HDmfOMK9nzjVPjcwCayqcAqMzdfNRMjJ	2026-09-09 20:19:16.406	EQtYKAc1QDXqK2VPOiNSmqknQhnWMjFJ	2026-08-30 05:48:18.497	2026-09-02 20:19:16.406	149.22.85.206	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:155.0) Gecko/20100101 Firefox/155.0	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe
r742tGX9YG7gO76C45rRayexLpIcLgPA	2026-09-28 20:08:02.608	qjfwTYOD3au6pPHyA1Iv0Kxm2LGWOIad	2026-09-21 20:08:02.608	2026-09-21 20:08:02.608	45.92.33.172	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
8U9Pxk9Dz93nedBs3ZIEIFaR2XCkeqjO	2026-09-16 10:18:53.318	cRAzSIxSWrkUgJQqesdkgSXPCUc5hhyQ	2026-09-09 10:18:53.318	2026-09-09 10:18:53.318	95.212.37.244	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
lVKb2owE5OXL5JvIk5DrZCUG3Z7aHbs1	2026-09-16 21:23:02.631	mmF6lmlzZwAuOEh9xRSNxZohvJGM9enM	2026-09-09 21:23:02.631	2026-09-09 21:23:02.631	37.48.182.141	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
FaMEu0sACjh3uw3qOpqE3E398XXpiEgk	2026-09-17 11:39:18.085	Qr8ps1eCAkxHyHw29tSfMYoZ8bDO1jCl	2026-09-09 10:17:00.84	2026-09-10 11:39:18.085	178.171.254.47	Mozilla/5.0 (iPhone; CPU iPhone OS 26_6_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/153.0.8010.24 Mobile/15E148 Safari/604.1	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
6bUJ11vQeu34bYrnRvlGOIFx9W2MmG33	2026-09-19 10:20:14.595	eIEdY5Gn0xKYL4BwsQmZAdqUJpJYdlUe	2026-09-12 10:20:14.596	2026-09-12 10:20:14.596	149.22.85.212	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
9sTem0YMOGnr43IQKiAnFaHrrxAZTy1s	2026-09-29 03:11:34.566	lcbbSldCcR1p5DKvdXwhJWI9xO5fUQRg	2026-09-22 03:11:34.566	2026-09-22 03:11:34.566	159.26.112.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
24JNOwip8D0TASLC0zMNLmVujF2Nuasd	2026-09-27 20:18:21.598	b1vYxoMr9UiuIFgYPgzNkO2ZqWM7Ctxn	2026-09-13 20:48:16.755	2026-09-20 20:18:21.598	85.204.70.92	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:156.0) Gecko/20100101 Firefox/156.0	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
oFYqYOAByo29pUfeHWvixtvqaUtv4PqA	2026-09-28 08:03:02.752	Jys1iOnySPWMInbvn3mRYC3EXESQPHYq	2026-09-21 08:03:02.761	2026-09-21 08:03:02.761	159.26.112.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
hP8GiwZFmIqcHO1ngjPaT2lD1vesYuOn	2026-09-28 08:06:14.557	4i2xVe72q22k3ed8yHwefvrBmru9b5eU	2026-09-21 08:06:14.557	2026-09-21 08:06:14.557	159.26.112.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
koOwOwO9MVfkQAwvqR5UfKVhkqAq4quI	2026-09-28 08:12:35.444	YdZCAx0mBhDxvYLa4zEkTLfflDtAyzf6	2026-09-21 08:12:35.444	2026-09-21 08:12:35.444	159.26.112.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
VSjdSiybBnjrdcXP1Iwx0gDDbI3w98FF	2026-09-28 08:31:40.147	gtSNhDrKPmko5A7mVpv11lrgpl5fQjEz	2026-09-21 08:31:40.148	2026-09-21 08:31:40.148	159.26.112.97	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
eS0itE0elU9LEjtwByxoBatD7KNouMxm	2026-09-29 03:25:57.483	czI08Jz8sCT8LRLZSy4796YbE1DAuG35	2026-09-22 03:25:57.484	2026-09-22 03:25:57.484	159.26.112.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
NMtzIpgvNdShBVfR0CEfnyNJaVCPKpn3	2026-09-29 04:24:54.796	9oW34lw6iFCcyHBQGx0qOpaAPuq0kgHW	2026-09-22 04:24:54.796	2026-09-22 04:24:54.796	159.26.112.101	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
2xK4cm1v4xyHgEOjd49HQ4invaU9mmV2	2026-10-03 15:24:53.798	YgNfEv10yJQvTlqXMgOy4CRIJGiykdUa	2026-09-26 15:24:53.798	2026-09-26 15:24:53.798	159.26.121.58	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
M6fIdPei0u1fomcLwHUTsHGZ3oW4mcQM	2026-10-03 22:03:42.827	GnrAncl3HMr9qJfWnuB35i4Ew7RfEsCm	2026-09-26 22:03:42.827	2026-09-26 22:03:42.827	159.26.121.58	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
Uv1MqrPubmgWq2PVsfAhxRsGzcQXF2oM	2026-10-03 23:23:23.492	OIcUDm8uDL7AjyTcPrHbopU8LH8FMh5S	2026-09-26 23:23:23.493	2026-09-26 23:23:23.493	159.26.121.58	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
Br1gKV7QdlIzoeRwNC07tWX37hKAIgJX	2026-10-05 08:28:41.102	vGaZCpt7CVrWs4OoHkVcRl7gefrybQfZ	2026-09-21 12:35:49.654	2026-09-28 08:28:41.102	85.204.70.114	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:157.0) Gecko/20100101 Firefox/157.0	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe
ugt6czHu6lS4C9d6hxMcmtSV89rAviaa	2026-10-06 04:50:47.195	HNcF95GUWxta8oSJVrGBrvpN0vMf8SsP	2026-09-29 04:50:47.195	2026-09-29 04:50:47.195	149.22.85.206	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
qVb0sXDBqtxzP1HVvJYrc97sMCXM6yYG	2026-10-06 04:56:42.814	Amx1IGs6mOAYcpl8WnthZNAitq1QfRdy	2026-09-29 04:56:42.814	2026-09-29 04:56:42.814	149.22.85.206	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
PsOYUx8HBBdGCQvzxlFCZKHb8sVjgaJv	2026-10-06 04:56:47.394	LvkK53Kn1CC65iT0nFxY2RQ1oGcr5w8N	2026-09-29 04:56:47.394	2026-09-29 04:56:47.394	149.22.85.206	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
iV9r5m1WQJy2TY6XF40DabuKCOVLeemi	2026-10-06 21:19:18.905	IR9OAduVN7QFDI0ipAzRLOgPDntYE7ad	2026-09-29 21:19:18.905	2026-09-29 21:19:18.905	46.213.127.96	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.0.0 Mobile Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
uBLWLTQdjTSUcnhNwD7DHNryHACt4bzY	2026-10-07 07:07:55.909	TQMTspwpo9K6HMWFUqg7FZXoTvAGWjuL	2026-09-30 07:07:55.91	2026-09-30 07:07:55.91	149.22.85.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
135N0aM8wdW3ZpXtn851j4bOWJkAPVnD	2026-10-07 07:08:30.486	TPlAHp1565DY0A3YBsunrZjrimJrav4y	2026-09-30 07:08:30.486	2026-09-30 07:08:30.486	149.22.85.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
97sJdSgJRHXWW2pN7Ds1eXHg2trEybNl	2026-10-12 13:32:14.518	VekPTZVXAFnrBYlZz5j1mSthHiu49fQD	2026-09-29 03:51:13.85	2026-10-05 13:32:14.518	193.19.204.89	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:157.0) Gecko/20100101 Firefox/157.0	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe
z4aFulRiAZ6eDJ2F2c3kS3OEX9ihunGF	2026-10-08 06:20:29.758	vQZHEclEeodQ8QkaCoEQY4CyZYIRkHOQ	2026-10-01 06:20:29.758	2026-10-01 06:20:29.758	129.224.207.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
fyz3FjKB4BdlzUwl0XkwTJm5Udk56v8m	2026-10-08 06:20:33.511	OgOJCJ6a9tn6LT4hXdf7vparsyBmNjYf	2026-10-01 06:20:33.511	2026-10-01 06:20:33.511	129.224.207.54	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
EK1Y0hb8rasM2ebV4I9tp64ucnMMbLn7	2026-10-10 00:33:03.124	JjQVly2g2Tr37A7MynxhtCIFOl0n79hI	2026-09-29 21:23:28.93	2026-10-03 00:33:03.124	188.229.253.239	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.0.1 Mobile/15E148 Safari/604.1	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
uTg3teSOc0OKKGJfN1BWEMzh6saw2gpD	2026-10-10 10:09:45.736	kiW9wSZ6JcNSoPZ0ADtclV1e0bX0lg9p	2026-10-03 10:09:45.736	2026-10-03 10:09:45.736	205.147.31.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
uLyHlE4EhMoUf3PCIZFmoEVGz26ZlaQ6	2026-10-10 10:09:50.399	z6ddbJe0CrhC5gd8TqrTjH8x5xqcQ0ig	2026-10-03 10:09:50.399	2026-10-03 10:09:50.399	205.147.31.7	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
0meNVOO8YA4RzmiKgJjtWOm5M69ONIbV	2026-10-10 17:42:50.366	SGICvNOVjsCdyJTJr94o0vA4DDdMuqrg	2026-10-03 17:42:50.366	2026-10-03 17:42:50.366	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
GmjbdpGhAb5iaHyBllAtK8vHqZJEznPT	2026-10-10 17:42:54.478	K9QpOWnYwD7R6KNGhQ2enKOm1EP4VHGP	2026-10-03 17:42:54.479	2026-10-03 17:42:54.479	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
WyDpDAGkDklhN3prfVd4PhTPUpIi8Ipj	2026-10-12 14:46:32.034	0nwGFqikziLy0dIa9di6rFjTnQ6iCdMp	2026-10-05 14:46:32.034	2026-10-05 14:46:32.034	72.251.215.14	Mozilla/5.0 (X11; Linux x86_64; rv:158.0) Gecko/20100101 Firefox/158.0	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe
LdBBeqaJDtRjVaKQUMtJpKN2Gx0GUQDV	2026-10-13 16:49:49.306	gli4JjaaKZRyGvE8E5Ab3t38kyS1H0YT	2026-10-03 20:27:12.631	2026-10-06 16:49:49.306	37.48.144.141	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/30.0 Chrome/143.0.0.0 Mobile Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
DLdUh8XDtomnqClMxXzdZatNBH8XWOzh	2026-10-16 12:56:19.992	BduurqaVWilP3A6ZcsFYzkZpldrIOtKR	2026-10-06 08:58:14.257	2026-10-09 12:56:19.992	193.19.204.89	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:158.0) Gecko/20100101 Firefox/158.0	OFQGb4ZJ0Drmo1NqATft0m1AEnB1xowe
wklUZu5cAVhGjDZCw49fuuOCMw6Z8XVM	2026-10-16 18:07:29.045	eL1KT63iJ1auQ5sXcfA43HP91do7WtPX	2026-10-09 18:07:29.045	2026-10-09 18:07:29.045	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:158.0) Gecko/20100101 Firefox/158.0	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
GJdIhUMRF5z5t0P2IjJxbQ3w25sNkFwJ	2026-10-16 21:47:09.987	9MtjvGNM6YB2Y1LRtCpfJSFFqV8pIzZj	2026-10-09 21:47:09.987	2026-10-09 21:47:09.987	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
zbb91PlSsyRYq1kFmR1pD9ysg6mbx9YN	2026-10-16 21:47:56.948	WoK1n4Z4ntHdR4Sz1qL3ilL5EgSEPMjg	2026-10-09 21:47:56.948	2026-10-09 21:47:56.948	127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
sTPIk8m4zpHF0mvavrAo54zNHVqShHnA	2026-10-16 21:48:18.637	QUnO0b8htmU2l1IzhsUHl44vCMK6NOKy	2026-10-09 21:48:18.637	2026-10-09 21:48:18.637	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
NPd4b2Uw0kI5C2s3gqfJXQBvRdPidPtl	2026-10-16 21:48:40.471	G7tRsW0GehK0NQYmFLzehZ2h1fkhlpj4	2026-10-09 21:48:40.471	2026-10-09 21:48:40.471	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
f2FpCZkMaLexEWLYVaDIC4KQJd4L31lZ	2026-10-16 23:20:56.418	2Kl9AgmQF1ZgynbvY3GfBXtGId4FBgDi	2026-10-09 23:20:56.419	2026-10-09 23:20:56.419	0000:0000:0000:0000:0000:0000:0000:0000	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
NtBxcicb2cnUPnRs4aCD66oppEvMzE5H	2026-10-16 23:24:18.708	atBH5A3a1mPrU6S6v0o4I0EhHzWSp5dE	2026-10-09 23:24:18.708	2026-10-09 23:24:18.708	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
VgE8JFwgMSlxrTKcdAygJnSEvnFhfGa4	2026-10-16 23:24:38.965	soUK1d9uWC9yRn4PgvQI6tDzwR1FkNQS	2026-10-09 23:24:38.965	2026-10-09 23:24:38.965	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
pXd0ZSbKqQq4DTK6mJJuM66k0E8JyNlo	2026-10-16 23:24:58.195	unZUqgVYai3z5gqcJmgJsLl4IcvTxHaT	2026-10-09 23:24:58.195	2026-10-09 23:24:58.195	205.147.31.9	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
QT1IJTJTqSyuBVFpZ8pLR95hdDYTBNtY	2026-10-19 07:06:14.816	Yyq5F8TJo4kuB99OJtlmhgHYqEd7Pr6H	2026-10-06 09:00:55.833	2026-10-12 07:06:14.816	193.19.204.83	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
DhOM5yrlaV8USKPUTm6JsTdRBC1AIVmr	2026-10-19 21:47:23.72	CYbDnssSzHQkV2AcYeu4Gm3mOgWaVZ9j	2026-10-10 09:48:28.699	2026-10-12 21:47:23.72	178.171.144.165	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Mobile Safari/537.36	N9Eisne7f8ONAbJ7R7TW2yNW3Jjvmape
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.verification (id, identifier, value, "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- PostgreSQL database dump complete
--

\unrestrict T8CkUD7oMOEeWxIJK9Bhtjd9crmSs7rij0bdCFtc20X1KzJHuF650Xbchnp3GFM

