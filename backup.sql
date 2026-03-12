--
-- PostgreSQL database dump
--

\restrict GvCYJgKWKLeR909JsW07xsUHpvlWuNGrogbtdwe8Qhf9WEBt08GnbzPdx6mMiPb

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ksa; Type: SCHEMA; Schema: -; Owner: ksauser
--

CREATE SCHEMA ksa;


ALTER SCHEMA ksa OWNER TO ksauser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ChatMessage; Type: TABLE; Schema: ksa; Owner: ksauser
--

CREATE TABLE ksa."ChatMessage" (
    id text NOT NULL,
    "senderName" text NOT NULL,
    text text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    sender text NOT NULL,
    "chatId" text
);


ALTER TABLE ksa."ChatMessage" OWNER TO ksauser;

--
-- Name: Ticket; Type: TABLE; Schema: ksa; Owner: ksauser
--

CREATE TABLE ksa."Ticket" (
    id text NOT NULL,
    name text NOT NULL,
    subject text NOT NULL,
    "problemDescription" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    status text DEFAULT 'open'::text NOT NULL,
    priority text DEFAULT 'medium'::text NOT NULL
);


ALTER TABLE ksa."Ticket" OWNER TO ksauser;

--
-- Name: User; Type: TABLE; Schema: ksa; Owner: ksauser
--

CREATE TABLE ksa."User" (
    id text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    department text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    role text DEFAULT 'user'::text NOT NULL
);


ALTER TABLE ksa."User" OWNER TO ksauser;

--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: ksa; Owner: ksauser
--

COPY ksa."ChatMessage" (id, "senderName", text, "timestamp", sender, "chatId") FROM stdin;
kv1wob	Support Admin	hi gimme a sec, imma be there ASAP!	2026-02-20 15:23:33.698	admin	\N
o4fzc	User	alright dawg, waitin	2026-02-20 15:24:35.175	user	\N
j82ich	Support Admin	hung on, gime your IP real quick, I dont wanna break ma back, on sum' I can fix right here	2026-02-20 15:43:39.233	admin	\N
l6zv7	User	what do you need, IP?	2026-02-23 11:22:24.907	user	\N
41zpmi	User	mmh	2026-03-10 10:31:16.673	user	\N
45prt	Warai Arab	hi still waiting	2026-03-10 10:47:46.985	user	Warai Arab
0huw4k	Warai Arab	e5typjhgfD	2026-03-10 14:14:09.296	user	Warai Arab
7f83z	Support Admin	ON IT	2026-03-10 14:15:50.326	admin	Warai Arab
yi0d8s	Warai Arab	zxcfuifgfxcv	2026-03-10 16:18:23.492	user	Warai Arab
e78scf	Support Admin	zfcv;kljhgfd	2026-03-10 16:19:50.207	admin	Warai Arab
\.


--
-- Data for Name: Ticket; Type: TABLE DATA; Schema: ksa; Owner: ksauser
--

COPY ksa."Ticket" (id, name, subject, "problemDescription", "createdAt", "updatedAt", status, priority) FROM stdin;
jzqm95	David Kinywa	Support Request	testing this app..	2026-02-23 11:18:46.41	2026-02-23 11:18:46.41	in progress	low
9ij37	Warai Arab	Support Request	I need a fix with the printer	2026-03-10 10:29:49.876	2026-03-10 10:29:49.876	open	medium
s95ibb	Warai Arab	Support Request	Still wainting..\n	2026-03-10 10:46:53.19	2026-03-10 10:46:53.19	open	medium
j7ioj	Warai Arab	Support Request	I can't use the contact form on your website. It is missing	2026-03-10 14:13:14.766	2026-03-10 14:13:14.766	open	high
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: ksa; Owner: ksauser
--

COPY ksa."User" (id, name, password, department, "createdAt", "updatedAt", role) FROM stdin;
dnkfru	admin	998877	IT	2026-02-20 15:19:04.84	2026-02-20 15:19:04.84	admin
mc735k	David Kinyua	123456	Space infrastructure	2026-02-20 15:20:40.307	2026-02-20 15:20:40.307	user
do80zn	David kinyua	123456	space i	2026-02-20 22:22:16.466	2026-02-20 22:22:16.466	user
t0sf9yi	David Kinywa	123456	Space infrustructure	2026-02-21 16:47:38.328	2026-02-21 16:47:38.328	user
wfvrn	user1	999999	IT	2026-02-23 11:48:23.295	2026-02-23 11:48:23.295	user
96mfai	Warai Arab	123456	Hr	2026-03-10 10:28:18.15	2026-03-10 10:28:18.15	user
\.


--
-- Name: ChatMessage ChatMessage_pkey; Type: CONSTRAINT; Schema: ksa; Owner: ksauser
--

ALTER TABLE ONLY ksa."ChatMessage"
    ADD CONSTRAINT "ChatMessage_pkey" PRIMARY KEY (id);


--
-- Name: Ticket Ticket_pkey; Type: CONSTRAINT; Schema: ksa; Owner: ksauser
--

ALTER TABLE ONLY ksa."Ticket"
    ADD CONSTRAINT "Ticket_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: ksa; Owner: ksauser
--

ALTER TABLE ONLY ksa."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User_name_key; Type: INDEX; Schema: ksa; Owner: ksauser
--

CREATE UNIQUE INDEX "User_name_key" ON ksa."User" USING btree (name);


--
-- PostgreSQL database dump complete
--

\unrestrict GvCYJgKWKLeR909JsW07xsUHpvlWuNGrogbtdwe8Qhf9WEBt08GnbzPdx6mMiPb

