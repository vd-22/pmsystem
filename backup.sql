--
-- PostgreSQL database dump
--

\restrict dVWhYb7Dg9EkA6CXkR6pPybCrqvyrTTejtkdHqe7KQRxann8zl6rUEw5mEeT64a

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: batches; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.batches (
    batch_id integer NOT NULL,
    product_id integer,
    order_item_id integer,
    batch_number text NOT NULL,
    expiration_date date NOT NULL
);


--
-- Name: batches_batch_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.batches_batch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: batches_batch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.batches_batch_id_seq OWNED BY public.batches.batch_id;


--
-- Name: branch; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.branch (
    branch_id integer NOT NULL,
    name text NOT NULL,
    address text,
    branch_type text,
    phone character varying(20),
    work_hours character varying(50),
    manager_name character varying(100),
    employee_count integer DEFAULT 0,
    monthly_revenue numeric(10,2) DEFAULT 0,
    is_active boolean DEFAULT true
);


--
-- Name: branch_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.branch_branch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: branch_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.branch_branch_id_seq OWNED BY public.branch.branch_id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    order_item_id integer NOT NULL,
    order_id integer,
    product_id integer,
    supplier_id integer,
    quantity integer NOT NULL,
    purchase_price numeric(10,2) NOT NULL
);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_order_item_id_seq OWNED BY public.order_items.order_item_id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    order_date date DEFAULT CURRENT_DATE NOT NULL,
    status text
);


--
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    product_id integer NOT NULL,
    name text NOT NULL,
    category text,
    manufacturer text
);


--
-- Name: products_product_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_product_id_seq OWNED BY public.products.product_id;


--
-- Name: stock_amount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_amount (
    stock_id integer NOT NULL,
    branch_id integer,
    batch_id integer,
    current_quantity integer NOT NULL,
    min_level integer DEFAULT 5,
    max_level integer DEFAULT 100,
    CONSTRAINT stock_amount_current_quantity_check CHECK ((current_quantity >= 0))
);


--
-- Name: stock_amount_stock_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_amount_stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_amount_stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_amount_stock_id_seq OWNED BY public.stock_amount.stock_id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.suppliers (
    supplier_id integer NOT NULL,
    name text NOT NULL,
    contact_info text
);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.suppliers_supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.suppliers_supplier_id_seq OWNED BY public.suppliers.supplier_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    role text,
    branch_id integer
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: batches batch_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches ALTER COLUMN batch_id SET DEFAULT nextval('public.batches_batch_id_seq'::regclass);


--
-- Name: branch branch_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch ALTER COLUMN branch_id SET DEFAULT nextval('public.branch_branch_id_seq'::regclass);


--
-- Name: order_items order_item_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN order_item_id SET DEFAULT nextval('public.order_items_order_item_id_seq'::regclass);


--
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- Name: products product_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN product_id SET DEFAULT nextval('public.products_product_id_seq'::regclass);


--
-- Name: stock_amount stock_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_amount ALTER COLUMN stock_id SET DEFAULT nextval('public.stock_amount_stock_id_seq'::regclass);


--
-- Name: suppliers supplier_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN supplier_id SET DEFAULT nextval('public.suppliers_supplier_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: batches; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.batches (batch_id, product_id, order_item_id, batch_number, expiration_date) FROM stdin;
1	1	1	B-2024-001	2026-12-31
2	2	2	B-2024-002	2025-06-30
3	3	3	B-2024-003	2027-03-15
4	4	4	B-2024-004	2026-08-20
5	5	5	B-2024-005	2026-11-30
6	6	6	B-2024-006	2027-01-15
7	7	7	B-2024-007	2026-09-10
8	8	8	B-2024-008	2025-12-31
9	9	9	B-2024-009	2026-06-30
10	10	10	B-2024-010	2025-09-15
11	11	11	B-2024-011	2025-10-20
12	12	12	B-2024-012	2026-07-31
13	13	13	B-2024-013	2027-02-28
14	14	14	B-2024-014	2026-04-30
15	15	15	B-2024-015	2026-05-31
16	16	16	B-2024-016	2026-10-15
17	17	17	B-2024-017	2026-08-31
18	18	18	B-2024-018	2027-04-30
19	19	19	B-2024-019	2027-05-31
20	20	20	B-2024-020	2027-06-30
21	21	21	B-2024-021	2026-03-31
22	22	22	B-2024-022	2026-02-28
23	23	23	B-2024-023	2026-11-15
24	24	24	B-2024-024	2026-07-20
25	25	25	B-2024-025	2027-01-31
26	26	26	B-2024-026	2026-09-30
27	27	27	B-2024-027	2025-11-30
28	28	28	B-2024-028	2026-12-15
29	29	29	B-2024-029	2027-08-31
30	30	30	B-2024-030	2026-06-15
31	31	31	B-2024-031	2027-09-30
32	32	32	B-2024-032	2026-04-15
33	33	33	B-2024-033	2026-08-10
34	34	34	B-2024-034	2026-10-31
35	35	35	B-2024-035	2026-07-15
36	36	36	B-2024-036	2028-01-01
37	37	37	B-2024-037	2027-12-31
38	38	38	B-2024-038	2027-06-30
39	39	39	B-2024-039	2028-03-31
40	40	40	B-2024-040	2028-06-30
41	41	41	B-2024-041	2027-11-30
42	42	42	B-2024-042	2026-05-31
43	43	43	B-2024-043	2026-06-30
44	44	44	B-2024-044	2026-07-31
45	45	45	B-2024-045	2026-08-31
46	46	46	B-2024-046	2026-09-30
47	47	47	B-2024-047	2026-10-31
48	48	48	B-2024-048	2026-11-30
49	49	49	B-2024-049	2026-12-31
50	50	50	B-2024-050	2027-01-31
189	51	122	B-2024-051	2027-02-28
190	52	123	B-2024-052	2027-03-31
191	53	124	B-2024-053	2027-04-30
192	54	125	B-2024-054	2027-05-31
193	55	126	B-2024-055	2027-06-30
194	56	127	B-2024-056	2026-12-31
195	57	128	B-2024-057	2027-01-31
196	58	129	B-2024-058	2026-11-30
197	59	130	B-2024-059	2027-02-28
198	60	131	B-2024-060	2027-03-31
199	61	132	B-2024-061	2026-10-31
200	62	133	B-2024-062	2026-09-30
201	63	134	B-2024-063	2027-04-30
202	64	135	B-2024-064	2027-05-31
203	65	136	B-2024-065	2026-08-31
204	66	137	B-2024-066	2025-05-15
205	67	138	B-2024-067	2025-04-30
206	68	139	B-2024-068	2027-06-30
207	69	140	B-2024-069	2027-07-31
208	70	141	B-2024-070	2027-08-31
209	71	142	B-2024-071	2026-07-31
210	72	143	B-2024-072	2026-06-30
211	73	144	B-2024-073	2027-09-30
212	74	145	B-2024-074	2027-10-31
213	75	146	B-2024-075	2026-05-31
214	76	147	B-2024-076	2025-03-31
215	77	148	B-2024-077	2027-11-30
216	78	149	B-2024-078	2027-12-31
217	79	150	B-2024-079	2026-04-30
218	80	151	B-2024-080	2028-01-31
219	81	152	B-2024-081	2028-02-28
220	82	153	B-2024-082	2026-03-31
221	83	154	B-2024-083	2028-03-31
222	84	155	B-2024-084	2028-04-30
223	85	156	B-2024-085	2026-02-28
224	86	157	B-2024-086	2028-05-31
225	87	158	B-2024-087	2028-06-30
226	88	159	B-2024-088	2026-01-31
227	89	160	B-2024-089	2028-07-31
228	90	161	B-2024-090	2028-08-31
229	91	162	B-2024-091	2028-09-30
230	92	163	B-2024-092	2028-10-31
231	93	164	B-2024-093	2028-11-30
232	94	165	B-2024-094	2028-12-31
233	95	166	B-2024-095	2029-01-31
234	96	167	B-2024-096	2029-02-28
\.


--
-- Data for Name: branch; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.branch (branch_id, name, address, branch_type, phone, work_hours, manager_name, employee_count, monthly_revenue, is_active) FROM stdin;
1	Філіал №1	вул. Хрещатик 1, Київ	pharmacy	+380 44 123 4567	8:00 - 22:00	Іваненко Олена Петрівна	12	458750.00	t
2	Філіал №2	вул. Льва Толстого 5, Київ	pharmacy	+380 44 234 5678	9:00 - 21:00	Коваленко Микола Іванович	8	325400.00	t
3	Філіал №3	вул. Степана Бандери 14, Київ	pharmacy	+380 44 345 6789	8:00 - 22:00	Петренко Світлана Василівна	10	389200.00	t
4	Філіал №4	вул. Володимира Івасюка 8, Київ	pharmacy	+380 44 456 7890	9:00 - 21:00	Сидоренко Андрій Михайлович	9	298600.00	t
5	Філіал №5	вул. Олександра Сашука 8, Київ	pharmacy	+380 44 567 8901	8:00 - 21:00	Мельник Тетяна Олексіївна	11	412300.00	f
6	Центральний склад	вул. Промислова 10, Київ	warehouse	+380 44 678 9012	8:00 - 20:00	Бондаренко Василь Петрович	10	0.00	t
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (order_item_id, order_id, product_id, supplier_id, quantity, purchase_price) FROM stdin;
1	1	1	1	100	12.50
2	1	2	1	50	45.00
3	1	3	2	200	8.75
4	2	4	2	80	15.00
5	2	5	3	120	22.00
6	1	1	1	200	8.50
7	1	2	2	100	32.00
8	1	3	3	150	6.00
9	1	4	4	120	14.00
10	1	5	5	80	95.00
11	1	6	6	60	110.00
12	1	7	7	200	45.00
13	1	8	8	90	78.00
14	1	9	9	70	85.00
15	1	10	10	50	22.00
16	2	11	10	40	25.00
17	2	12	4	100	16.00
18	2	13	11	150	12.00
19	2	14	9	200	8.00
20	2	15	10	80	35.00
21	2	16	1	100	42.00
22	2	17	12	90	68.00
23	2	18	13	120	55.00
24	2	19	13	130	48.00
25	2	20	13	60	72.00
26	3	21	3	80	18.00
27	3	22	3	100	15.00
28	3	23	48	70	28.00
29	3	24	14	90	65.00
30	3	25	15	60	88.00
31	3	26	16	110	42.00
32	3	27	17	80	95.00
33	3	28	18	100	78.00
34	3	29	1	150	22.00
35	3	30	19	70	115.00
36	4	31	20	200	18.00
37	4	32	21	120	85.00
38	4	33	10	300	5.00
39	4	34	1	150	32.00
40	4	35	8	100	28.00
41	4	36	22	80	650.00
42	4	37	23	50	1200.00
43	4	38	24	60	85.00
44	4	39	25	40	2800.00
45	4	40	26	30	3500.00
46	5	41	23	35	1800.00
47	5	42	27	200	12.00
48	5	43	28	500	8.50
49	5	44	21	400	9.00
50	5	45	29	300	18.00
51	5	46	1	500	4.00
52	5	47	1	400	5.50
53	5	48	30	100	45.00
54	5	49	31	150	38.00
55	5	50	32	120	52.00
56	6	1	1	180	8.70
57	6	2	2	90	31.50
58	6	3	3	140	6.20
59	6	4	4	110	13.80
60	6	5	5	75	96.00
61	6	6	6	55	112.00
62	6	7	7	210	44.50
63	6	8	8	95	79.00
64	6	9	9	65	86.00
65	6	10	10	60	21.50
66	7	11	10	45	24.80
67	7	12	4	120	15.90
68	7	13	11	160	11.70
69	7	14	9	220	7.90
70	7	15	10	85	34.50
71	7	16	1	110	41.00
72	7	17	12	95	67.00
73	7	18	13	130	54.00
74	7	19	13	140	47.50
75	7	20	13	75	71.00
76	5	51	33	100	48.00
77	5	52	34	120	35.00
78	5	53	35	80	28.00
79	5	54	36	200	22.00
80	5	55	37	150	18.00
81	5	56	38	100	42.00
82	5	57	39	80	55.00
83	5	58	40	120	32.00
84	5	59	41	100	65.00
85	5	60	42	90	78.00
122	6	51	33	100	35.00
123	6	52	34	120	28.00
124	6	53	35	80	42.00
125	6	54	36	150	22.00
126	6	55	1	200	18.00
127	6	56	35	90	32.00
128	6	57	20	110	15.00
129	6	58	35	70	48.00
130	6	59	37	80	55.00
131	6	60	16	100	62.00
132	7	61	39	90	45.00
133	7	62	13	80	38.00
134	7	63	35	100	28.00
135	7	64	47	120	25.00
136	7	65	37	150	18.00
137	7	66	2	100	22.00
138	7	67	2	80	35.00
139	7	68	37	90	42.00
140	7	69	16	70	55.00
141	7	70	37	60	48.00
142	8	71	13	100	32.00
143	8	72	20	80	28.00
144	8	73	41	90	38.00
145	8	74	16	70	65.00
146	8	75	44	80	72.00
147	8	76	40	100	58.00
148	8	77	42	90	45.00
149	8	78	16	80	38.00
150	8	79	44	100	85.00
151	8	80	4	120	95.00
152	9	81	20	150	18.00
153	9	82	20	200	22.00
154	9	83	46	100	28.00
155	9	84	45	80	32.00
156	9	85	1	200	8.00
157	9	86	13	150	42.00
158	9	87	16	100	55.00
159	9	88	2	200	12.00
160	9	89	16	80	65.00
161	9	90	45	100	38.00
162	9	91	46	120	28.00
163	9	92	1	300	5.00
164	9	93	1	250	6.00
165	9	94	29	200	15.00
166	9	95	1	180	9.00
167	9	96	48	150	12.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (order_id, order_date, status) FROM stdin;
1	2024-01-15	received
2	2024-02-10	received
3	2024-01-10	received
4	2024-02-15	received
5	2024-03-20	received
6	2024-04-05	received
7	2024-05-12	received
8	2024-06-10	received
9	2024-07-15	received
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (product_id, name, category, manufacturer) FROM stdin;
1	Парацетамол	Знеболювальні	Фармак
2	Амоксицилін	Антибіотики	Дарниця
3	Вітамін С	Вітаміни	Київмедпрепарат
4	Аспірин	Знеболювальні	Bayer
5	Олідетрим 2000 капс. №60	Вітаміни	Медана
6	Декрістол D3 4000 МО таблетки №30	Вітаміни	Mibe GmbH Arzneimittel
7	Цинк Активний таблетки 0,25 г №80	Вітаміни	Еліт-фарм
8	Азитроміцин-Астрафарм капс. 500 мг	Антибіотики	Астрафарм
9	Сумамед табл. в/плівк. обол. 500 мг	Антибіотики	Сумамед
10	Експрес тест на антиген коронавірусу Testsealabs Covid-19	Тест-система	Testsealabs
11	Тест Cito Test Covid-19 на антитіла для діагностики коронавірусної інфекції G27072S	Тест-система	Testsealabs
12	Аспірин Кардіо табл. в/о кишково-розч. 100 мг блістер	Знеболювальні	Bayer
13	Валеріана табл. в/о 30 мг	Снодійні препарати	Медіка
14	Перекису водню розчин 3% для зовніш. заст. фл. 200 мл	Антисептики	Сумамед
15	Декасан р-н 0,2 мг/мл пляшка скляна 400 мл	Антисептики	Testsealabs
16	АЦЦ Лонг табл. шип. 600 мг туба	Ліки від кашлю	АЦЦ
17	Синупрет екстракт таблетки	Ліки від нежитю	Bionorica
18	Лінекс Форте капс. блістер	Засоби від діареї	Sandoz
19	Лінекс капс. блістер	Засоби від діареї	Sandoz
20	Лінекс Бебі пор. 1,5 г	Засоби від діареї	Sandoz
21	Корвалмент капс. 0,1 г	Ліки від стенокардії	Київмедпрепарат
22	Корвалол краплі 50 мл	Ліки від стенокардії	Київмедпрепарат
23	Кверцетин гранули 2 г	Ліки від стенокардії	Борщагівський ХФЗ
24	Тантум Верде спрей 30 мл	Ліки від болю в горлі	Aziende
25	Ісла-Моос пастилки №30	Ліки від болю в горлі	Engelhard Arzneimittel Gmbh
26	Декатилен таблетки	Ліки від болю в горлі	Teva
27	Флікс спрей назальний 0,05%	Ліки від нежитю	Абді Ібрахім
28	Отривін спрей 0,1% 10 мл	Ліки від нежитю	Novartis
29	Но-соль спрей 0,65% 15 мл	Ліки від нежитю	Фармак
30	Назонекс Синус спрей 50 мкг	Ліки від нежитю	Шерінг
31	Аквамакс спрей 100 мл	Сольові розчини для носа	Здоровя
32	Лазолван сироп 100 мл	Ліки від кашлю	Берінгер
33	Вугілля активоване таблетки №10	Ентеросорбенти	Testsealabs
34	Сорбекс Дуо капсули №20	Ентеросорбенти	Валартін Фарма
35	Смекта порошок саше	Ентеросорбенти	Астрафарм
36	Термометр цифровий	Термометри медичні	ProMedica
37	Тонометр AND UA-704	Тонометри	AND
38	Тест-смужки Contour Plus	Тест-смужки для глюкометрів	Contour Plus
39	Глюкометр Gamma Diamond Prima	Глюкометр	Гамма
40	Небулайзер Ulaizer CN-02MY	Інгалятори	Ulaizer
41	Gamma Control тонометр	Тонометри	AND
42	Джгут Есмарха гумовий	Джгути	Київгума
43	Маска медична Славна 100 шт	Медичні маски	Славна
44	Маска медична 100 шт	Медичні маски	Берінгер
45	Рукавички нітрилові MedPlast	Рукавички і напальчники	MP MedPlast
46	Напальчник гумовий	Рукавички і напальчники	Валартін Фарма
47	Рукавички хірургічні стерильні	Рукавички і напальчники	Валартін Фарма
48	Табекс табл. 1,5 мг	Засоби від куріння	Sopharma
49	Фервекс порошок	Ліки від застуди	UPSA
50	Ібупрофен таблетки 200 мг	Знеболювальні	Zentiva
51	Німесил порошок	Знеболювальні	Berlin-Chemie
52	Но-шпа таблетки 40 мг	Спазмолітики	Sanofi
53	Дротаверин таблетки	Спазмолітики	Фармак
54	Лоперамід капсули	Засоби від діареї	Здоровя
55	Регідрон порошок	Електроліти	Orion
56	Смекта саше	Ентеросорбенти	Ipsen
57	Еспумізан капсули	Вітрогінні	Berlin-Chemie
58	Омепразол капсули	ІПП	KRKA
59	Пантопразол таблетки	ІПП	Teva
60	Урсофальк капсули	Гепатопротектори	Dr. Falk
61	Кардіомагніл таблетки	Кардіопрепарати	Takeda
62	Клопідогрель таблетки	Антиагреганти	Sandoz
63	Варфарин таблетки	Антикоагулянти	Orion
64	Метформін таблетки	Антидіабетичні	Merck
65	Глібенкламід таблетки	Антидіабетичні	Berlin-Chemie
66	Левотироксин таблетки	Гормони	Berlin-Chemie
67	Амлодипін таблетки	Антигіпертензивні	Teva
68	Лізиноприл таблетки	Антигіпертензивні	KRKA
69	Бісопролол таблетки	Бета-блокатори	Sandoz
70	Еналаприл таблетки	Антигіпертензивні	Zentiva
71	Раміприл таблетки	Антигіпертензивні	Sanofi
72	Фурацилін таблетки	Антисептики	Дарниця
73	Хлоргексидин розчин	Антисептики	Фармак
74	Мірамістин спрей	Антисептики	Infamed
75	Бетадин розчин	Антисептики	Egis
76	Лінкоміцин капсули	Антибіотики	Дарниця
77	Цефтріаксон порошок	Антибіотики	KRKA
78	Ципрофлоксацин таблетки	Антибіотики	Teva
79	Доксициклін капсули	Антибіотики	Zentiva
80	Кларитроміцин таблетки	Антибіотики	Sandoz
81	Флуконазол капсули	Протигрибкові	Teva
82	Кетоконазол мазь	Протигрибкові	Здоровя
83	Ацикловір мазь	Противірусні	Stada
84	Валацикловір таблетки	Противірусні	Teva
85	Гідрокортизон мазь	Гормональні мазі	GSK
86	Диклофенак гель	Знеболювальні	Sandoz
87	Кеторолак таблетки	Знеболювальні	Dr. Reddy’s
88	Парацетамол дитячий сироп	Знеболювальні	Фармак
89	Саліцилова мазь	Антисептики	Дарниця
90	Бепантен мазь	Дерматологічні засоби	Bayer
91	Пантенол спрей	Дерматологічні засоби	Здоровя
92	Називін краплі	Ліки від нежитю	Takeda
93	Санорин краплі	Ліки від нежитю	Teva
94	Аквамаріс спрей	Сольові розчини для носа	JGL
95	Хьюмер спрей	Сольові розчини для носа	Urgo
96	Натрію хлорид розчин	Інфузійні розчини	Борщагівський ХФЗ
\.


--
-- Data for Name: stock_amount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_amount (stock_id, branch_id, batch_id, current_quantity, min_level, max_level) FROM stdin;
117	1	1	50	10	200
118	1	2	5	10	100
119	1	3	120	20	300
120	1	4	8	10	150
121	1	5	200	30	400
122	1	6	45	10	200
123	1	7	30	10	100
124	1	8	15	10	150
125	1	9	25	10	200
126	1	10	3	10	100
127	1	11	60	10	200
128	1	12	40	10	150
129	1	13	80	20	300
130	1	14	100	20	400
131	1	15	35	10	200
132	1	16	20	10	150
133	1	17	55	10	200
134	1	18	70	20	300
135	1	19	90	20	300
136	1	20	25	10	150
137	2	1	30	10	200
138	2	2	8	10	100
139	2	3	90	20	300
140	2	4	12	10	150
141	2	5	150	30	400
142	2	6	35	10	200
143	2	7	20	10	100
144	2	8	40	10	150
145	2	9	18	10	200
146	2	10	7	10	100
147	2	11	45	10	200
148	2	12	25	10	150
149	2	13	60	20	300
150	2	14	80	20	400
151	2	15	22	10	200
152	2	16	15	10	150
153	2	17	40	10	200
154	2	18	55	20	300
155	2	19	70	20	300
156	2	20	18	10	150
157	3	21	40	10	200
158	3	22	60	10	300
159	3	23	25	10	150
160	3	24	35	10	200
161	3	25	15	10	100
162	3	26	50	10	200
163	3	27	4	10	100
164	3	28	70	20	300
165	3	29	45	10	200
166	3	30	20	10	150
167	3	31	80	20	300
168	3	32	30	10	200
169	3	33	200	50	500
170	3	34	55	10	200
171	3	35	40	10	150
172	3	36	3	2	10
173	3	37	5	2	15
174	3	38	8	3	20
175	3	39	2	1	8
176	3	40	4	2	10
177	4	41	3	2	10
178	4	42	100	20	400
179	4	43	300	50	1000
180	4	44	250	50	800
181	4	45	180	30	600
182	4	46	400	50	1000
183	4	47	350	50	800
184	4	48	60	10	200
185	4	49	80	10	300
186	4	50	70	10	250
187	4	189	45	10	200
188	4	190	55	10	200
189	4	191	30	10	150
190	4	192	90	20	300
191	4	193	120	20	400
192	4	194	40	10	200
193	4	195	65	10	250
194	4	196	35	10	150
195	4	197	50	10	200
196	4	198	75	10	300
197	5	199	40	10	200
198	5	200	30	10	150
199	5	201	55	10	200
200	5	202	70	10	300
201	5	203	85	20	300
202	5	204	25	10	150
203	5	205	20	10	100
204	5	206	45	10	200
205	5	207	35	10	150
206	5	208	28	10	150
207	5	209	60	10	250
208	5	210	40	10	200
209	5	211	55	10	200
210	5	212	30	10	150
211	5	213	45	10	200
212	5	214	15	10	100
213	5	215	50	10	200
214	5	216	35	10	150
215	5	217	20	10	100
216	5	218	25	10	150
217	6	219	500	100	2000
218	6	220	800	100	3000
219	6	221	1200	200	5000
220	6	222	600	100	2000
221	6	223	900	200	4000
222	6	224	400	100	2000
223	6	225	700	100	3000
224	6	226	550	100	2000
225	6	227	300	50	1500
226	6	228	450	100	2000
227	6	229	350	50	1500
228	6	230	2000	500	8000
229	6	231	1500	300	6000
230	6	232	800	100	3000
231	6	233	600	100	2500
232	6	234	700	100	3000
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (supplier_id, name, contact_info) FROM stdin;
1	Фармак	farmak@ua.com
2	Дарниця	darnytsia@ua.com
3	Київмедпрепарат	kyivmedpreparat@ua.com
4	Bayer	bayer@globalpharma.com
5	Медана	medana@ua.com
6	Mibe GmbH Arzneimittel	mibe@de-pharma.com
7	Еліт-фарм	elitpharm@ua.com
8	Астрафарм	astrapharm@ua.com
9	Сумамед	sumamed@ua.com
10	Testsealabs	testsealabs@cn-pharma.com
11	Медіка	medika@ua.com
12	Bionorica	bionorica@de-pharma.com
13	Sandoz	sandoz@novartis.com
14	Aziende	aziende@eu-pharma.com
15	Engelhard Arzneimittel Gmbh	engelhard@de-pharma.com
16	Teva	teva@globalpharma.com
17	Абді Ібрахім	abdiibrahim@tr-pharma.com
18	Novartis	novartis@globalpharma.com
19	Шерінг	schering@globalpharma.com
20	Здоровя	zdorovya@ua.com
21	Берінгер	boehringer@globalpharma.com
22	ProMedica	promedica@ua.com
23	AND	and@medical.jp
24	Contour Plus	contour@devices.com
25	Гамма	gamma@ua.com
26	Ulaizer	ulaizer@ua.com
27	Київгума	kyivguma@ua.com
28	Славна	slavna@ua.com
29	MP MedPlast	medplast@ua.com
30	Sopharma	sopharma@bg-pharma.com
31	UPSA	upsa@fr-pharma.com
32	Zentiva	zentiva@eu-pharma.com
33	Berlin-Chemie	berlinchemie@de-pharma.com
34	Sanofi	sanofi@globalpharma.com
35	Orion	orion@fi-pharma.com
36	Ipsen	ipsen@fr-pharma.com
37	KRKA	krka@si-pharma.com
38	Dr. Falk	drfalk@de-pharma.com
39	Takeda	takeda@jp-pharma.com
40	Egis	egis@hu-pharma.com
41	Infamed	infamed@eu-pharma.com
42	Stada	stada@de-pharma.com
43	DrReddys	drreddys@in-pharma.com
44	GSK	gsk@globalpharma.com
45	JGL	jgl@hr-pharma.com
46	Urgo	urgo@fr-pharma.com
47	Merck	merck@globalpharma.com
48	Борщагівський ХФЗ	bphz@ua.com
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (user_id, username, password_hash, role, branch_id) FROM stdin;
2	admin	secret	warehouse_manager	\N
3	pharmacist1	pharmacist123	pharmacist	1
4	manager1	manager123	branch_manager	1
5	purchase1	purchase123	purchase_manager	\N
6	warehouse1	warehouse123	warehouse_manager	\N
7	admin1	admin123	admin	\N
\.


--
-- Name: batches_batch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.batches_batch_id_seq', 234, true);


--
-- Name: branch_branch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.branch_branch_id_seq', 6, true);


--
-- Name: order_items_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_order_item_id_seq', 167, true);


--
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 14, true);


--
-- Name: products_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_product_id_seq', 96, true);


--
-- Name: stock_amount_stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_amount_stock_id_seq', 232, true);


--
-- Name: suppliers_supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_supplier_id_seq', 48, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_user_id_seq', 7, true);


--
-- Name: batches batches_order_item_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_order_item_id_key UNIQUE (order_item_id);


--
-- Name: batches batches_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_pkey PRIMARY KEY (batch_id);


--
-- Name: batches batches_product_id_batch_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_product_id_batch_number_key UNIQUE (product_id, batch_number);


--
-- Name: branch branch_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.branch
    ADD CONSTRAINT branch_pkey PRIMARY KEY (branch_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);


--
-- Name: stock_amount stock_amount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_amount
    ADD CONSTRAINT stock_amount_pkey PRIMARY KEY (stock_id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (supplier_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: batches batches_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(order_item_id);


--
-- Name: batches batches_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.batches
    ADD CONSTRAINT batches_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id);


--
-- Name: order_items order_items_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(supplier_id);


--
-- Name: stock_amount stock_amount_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_amount
    ADD CONSTRAINT stock_amount_batch_id_fkey FOREIGN KEY (batch_id) REFERENCES public.batches(batch_id);


--
-- Name: stock_amount stock_amount_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_amount
    ADD CONSTRAINT stock_amount_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id);


--
-- Name: users users_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branch(branch_id);


--
-- PostgreSQL database dump complete
--

\unrestrict dVWhYb7Dg9EkA6CXkR6pPybCrqvyrTTejtkdHqe7KQRxann8zl6rUEw5mEeT64a

