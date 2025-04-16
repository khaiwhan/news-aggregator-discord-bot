-- public.config definition

-- Drop table

-- DROP TABLE public.config;

CREATE TABLE public.config (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	platform varchar NOT NULL,
	active bool DEFAULT true NOT NULL,
	"order" int8 DEFAULT '0'::bigint NOT NULL,
	keyword json NULL,
	CONSTRAINT config_pkey PRIMARY KEY (id)
);


-- public.seen definition

-- Drop table

-- DROP TABLE public.seen;

CREATE TABLE public.seen (
	url_id varchar NOT NULL,
	created_date timestamp DEFAULT now() NOT NULL,
	title text NULL,
	CONSTRAINT seen_pkey PRIMARY KEY (url_id)
);