--
-- PostgreSQL database dump
--

\restrict GlNaFdGWdfQvOEYaNxBR8Ow2bwOhdsH04NcX4xFmGttKFO9fD04R3SOwh6W5Bl5

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-01 12:34:51 EST

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
-- TOC entry 6 (class 2615 OID 16389)
-- Name: users; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA users;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16416)
-- Name: sales_team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sales_team (
    id bigint NOT NULL,
    first_name character varying(255),
    last_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    calls integer NOT NULL,
    average_ratings integer NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 16415)
-- Name: sales_team_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sales_team_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 222
-- Name: sales_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sales_team_id_seq OWNED BY public.sales_team.id;


--
-- TOC entry 224 (class 1259 OID 16431)
-- Name: tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tokens (
    token character varying(512) NOT NULL,
    expires date NOT NULL,
    status character varying(10),
    user_id integer NOT NULL
);


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN tokens.user_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tokens.user_id IS 'user related to this token';


--
-- TOC entry 225 (class 1259 OID 16451)
-- Name: tokens_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tokens_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 225
-- Name: tokens_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tokens_user_id_seq OWNED BY public.tokens.user_id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(10) DEFAULT 'user'::character varying NOT NULL,
    username character varying(255) NOT NULL,
    auth_version integer
);


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN "user".auth_version; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public."user".auth_version IS 'this is used for logout all logic';


--
-- TOC entry 221 (class 1259 OID 16393)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- TOC entry 3302 (class 2604 OID 16419)
-- Name: sales_team id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_team ALTER COLUMN id SET DEFAULT nextval('public.sales_team_id_seq'::regclass);


--
-- TOC entry 3303 (class 2604 OID 16452)
-- Name: tokens user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens ALTER COLUMN user_id SET DEFAULT nextval('public.tokens_user_id_seq'::regclass);


--
-- TOC entry 3300 (class 2604 OID 16394)
-- Name: user id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- TOC entry 3465 (class 0 OID 16416)
-- Dependencies: 223
-- Data for Name: sales_team; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sales_team VALUES
	(1, 'Allayne', 'Scogin', 'ascogin0@psu.edu', 18, 2),
	(2, 'Vinnie', 'De Cruce', 'vdecruce1@vkontakte.ru', 317, 1),
	(3, 'Caspar', 'Boorman', 'cboorman2@privacy.gov.au', 286, 1),
	(4, 'Duky', 'Boerder', 'dboerder3@buzzfeed.com', 597, 1),
	(5, 'Devlen', 'Casacchia', 'dcasacchia4@japanpost.jp', 291, 5),
	(6, 'Moss', 'Garritley', 'mgarritley5@netlog.com', 390, 2),
	(7, 'Radcliffe', 'Lead', 'rlead6@weibo.com', 43, 2),
	(8, 'Charles', 'Fritchley', 'cfritchley7@google.ca', 486, 3),
	(9, 'Ceciley', 'Paice', 'cpaice8@phpbb.com', 590, 1),
	(10, 'Dionne', 'Kuban', 'dkuban9@paginegialle.it', 497, 5);
INSERT INTO public.sales_team VALUES
	(11, 'Laurice', 'Haine', 'lhainea@wp.com', 329, 1),
	(12, 'Gerti', 'Mault', 'gmaultb@patch.com', 499, 4),
	(13, 'Lucho', 'Rawson', 'lrawsonc@ed.gov', 566, 4),
	(14, 'Morly', 'O''Coskerry', 'mocoskerryd@jigsy.com', 500, 4),
	(15, 'Rodge', 'Cockerell', 'rcockerelle@digg.com', 16, 3),
	(16, 'Dukie', 'Acedo', 'dacedof@techcrunch.com', 261, 3),
	(17, 'Maurizia', 'Chetham', 'mchethamg@google.com.hk', 340, 3),
	(18, 'Wally', 'Illingsworth', 'willingsworthh@imdb.com', 188, 3),
	(19, 'Ardra', 'Tipping', 'atippingi@usnews.com', 437, 1),
	(20, 'Wit', 'Matushevitz', 'wmatushevitzj@skyrock.com', 529, 4);
INSERT INTO public.sales_team VALUES
	(21, 'Cissiee', 'Thornham', 'cthornhamk@unicef.org', 241, 5),
	(22, 'Pam', 'Beadon', 'pbeadonl@vimeo.com', 341, 2),
	(23, 'Herrick', 'Winter', 'hwinterm@yellowpages.com', 16, 1),
	(24, 'Augie', 'Broxup', 'abroxupn@google.com.br', 285, 2),
	(25, 'Ezechiel', 'Colwell', 'ecolwello@cam.ac.uk', 157, 2),
	(26, 'Chris', 'Dobbison', 'cdobbisonp@patch.com', 42, 1),
	(27, 'Margarita', 'Challenor', 'mchallenorq@artisteer.com', 125, 1),
	(28, 'Ninon', 'Langrish', 'nlangrishr@vk.com', 254, 3),
	(29, 'Carce', 'Harmer', 'charmers@aboutads.info', 498, 1),
	(30, 'Ardelia', 'Scandrett', 'ascandrettt@fc2.com', 97, 2);
INSERT INTO public.sales_team VALUES
	(31, 'Julia', 'Moggle', 'jmoggleu@cnet.com', 490, 4),
	(32, 'Lorry', 'Runcie', 'lrunciev@google.com.au', 168, 3),
	(33, 'Stanislaus', 'Frostdyke', 'sfrostdykew@flavors.me', 507, 3),
	(34, 'Charlie', 'MacGillespie', 'cmacgillespiex@seattletimes.com', 6, 2),
	(35, 'Weidar', 'Dominey', 'wdomineyy@dion.ne.jp', 127, 4),
	(36, 'Dag', 'Osanne', 'dosannez@ustream.tv', 333, 1),
	(37, 'Glenn', 'Drexel', 'gdrexel10@washingtonpost.com', 478, 1),
	(38, 'Fanchon', 'Kissack', 'fkissack11@dailymotion.com', 575, 2),
	(39, 'Wendeline', 'Pinchback', 'wpinchback12@tinyurl.com', 369, 3),
	(40, 'Isidora', 'Roussel', 'iroussel13@microsoft.com', 374, 4);


--
-- TOC entry 3466 (class 0 OID 16431)
-- Dependencies: 224
-- Data for Name: tokens; Type: TABLE DATA; Schema: public; Owner: -
--


--
-- TOC entry 3462 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."user" VALUES
	(1, '$2b$10$4nCcah1l6bJs7ZWFSuU51OyKOlxAcdMyxoa1h2MKKxNHDHe50Si2S', 'user', 'tommy', NULL),


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 222
-- Name: sales_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_team_id_seq', 2000, true);


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 225
-- Name: tokens_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tokens_user_id_seq', 2, true);


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 221
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.user_id_seq', 4, true);


--
-- TOC entry 3309 (class 2606 OID 16430)
-- Name: sales_team Email is Unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_team
    ADD CONSTRAINT "Email is Unique" UNIQUE (email);


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 3309
-- Name: CONSTRAINT "Email is Unique" ON sales_team; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT "Email is Unique" ON public.sales_team IS 'all emails must identify 1 person';


--
-- TOC entry 3311 (class 2606 OID 16428)
-- Name: sales_team sales_team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sales_team
    ADD CONSTRAINT sales_team_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16439)
-- Name: tokens tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT tokens_pkey PRIMARY KEY (token);


--
-- TOC entry 3305 (class 2606 OID 16450)
-- Name: user unique username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "unique username" UNIQUE (username);


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 3305
-- Name: CONSTRAINT "unique username" ON "user"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT "unique username" ON public."user" IS 'all usernames must be unique';


--
-- TOC entry 3307 (class 2606 OID 16402)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3314 (class 2606 OID 16460)
-- Name: tokens user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tokens
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES public."user"(id) NOT VALID;


-- Completed on 2025-12-01 12:34:51 EST

--
-- PostgreSQL database dump complete
--

\unrestrict GlNaFdGWdfQvOEYaNxBR8Ow2bwOhdsH04NcX4xFmGttKFO9fD04R3SOwh6W5Bl5

