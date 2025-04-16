CREATE TABLE public.config (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	platform varchar NOT NULL,
	active bool DEFAULT true NOT NULL,
	"order" int8 DEFAULT '0'::bigint NOT NULL,
	keyword json NULL,
	CONSTRAINT config_pkey PRIMARY KEY (id)
);

CREATE TABLE public.seen (
	url_id varchar NOT NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	title text NULL,
	CONSTRAINT seen_pkey PRIMARY KEY (url_id)
);

CREATE TABLE public.logs (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	start_date timestamp NOT NULL,
	finish_date timestamp NULL,
	duration numeric NULL,
	duration_format varchar NULL,
	status varchar NULL,
	CONSTRAINT logs_pkey PRIMARY KEY (id)
);