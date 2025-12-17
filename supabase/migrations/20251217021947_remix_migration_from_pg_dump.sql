CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: document_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.document_status AS ENUM (
    'uploaded',
    'pending_review',
    'approved',
    'rejected',
    'signed'
);


--
-- Name: service_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.service_status AS ENUM (
    'pending',
    'in_progress',
    'awaiting_approval',
    'approved',
    'completed',
    'overdue',
    'cancelled'
);


--
-- Name: service_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.service_type AS ENUM (
    'gst',
    'itr',
    'audit',
    'company_registration',
    'msme_registration',
    'dsc',
    'licensing'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'staff',
    'client'
);


--
-- Name: get_user_role(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_role(user_id uuid) RETURNS public.user_role
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT role FROM public.profiles WHERE id = user_id
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'client')
  );
  RETURN NEW;
END;
$$;


--
-- Name: is_admin_or_staff(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.is_admin_or_staff(user_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role IN ('admin', 'staff')
  )
$$;


--
-- Name: update_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: activities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    client_id uuid,
    service_request_id uuid,
    document_id uuid,
    action text NOT NULL,
    description text,
    metadata jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: clients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.clients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    business_name text NOT NULL,
    gstin text,
    pan text NOT NULL,
    email text NOT NULL,
    phone text,
    address text,
    city text,
    state text,
    pincode text,
    compliance_score integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT clients_compliance_score_check CHECK (((compliance_score >= 0) AND (compliance_score <= 100)))
);


--
-- Name: documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    service_request_id uuid,
    client_id uuid,
    name text NOT NULL,
    file_path text NOT NULL,
    file_type text,
    file_size integer,
    category text,
    ai_category text,
    status public.document_status DEFAULT 'uploaded'::public.document_status NOT NULL,
    uploaded_by uuid,
    reviewed_by uuid,
    signed_at timestamp with time zone,
    signature_data text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text NOT NULL,
    full_name text,
    phone text,
    role public.user_role DEFAULT 'client'::public.user_role NOT NULL,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    client_id uuid NOT NULL,
    service_type public.service_type NOT NULL,
    title text NOT NULL,
    description text,
    status public.service_status DEFAULT 'pending'::public.service_status NOT NULL,
    due_date date,
    financial_year text,
    period text,
    amount numeric(12,2),
    assigned_to uuid,
    priority text DEFAULT 'medium'::text,
    progress integer DEFAULT 0,
    notes text,
    created_by uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    CONSTRAINT service_requests_priority_check CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text]))),
    CONSTRAINT service_requests_progress_check CHECK (((progress >= 0) AND (progress <= 100)))
);


--
-- Name: activities activities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_pkey PRIMARY KEY (id);


--
-- Name: clients clients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_pkey PRIMARY KEY (id);


--
-- Name: documents documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: idx_activities_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activities_client_id ON public.activities USING btree (client_id);


--
-- Name: idx_activities_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activities_created_at ON public.activities USING btree (created_at DESC);


--
-- Name: idx_clients_gstin; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_gstin ON public.clients USING btree (gstin);


--
-- Name: idx_clients_pan; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_pan ON public.clients USING btree (pan);


--
-- Name: idx_clients_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_clients_user_id ON public.clients USING btree (user_id);


--
-- Name: idx_documents_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_client_id ON public.documents USING btree (client_id);


--
-- Name: idx_documents_service_request_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_documents_service_request_id ON public.documents USING btree (service_request_id);


--
-- Name: idx_service_requests_client_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_requests_client_id ON public.service_requests USING btree (client_id);


--
-- Name: idx_service_requests_due_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_requests_due_date ON public.service_requests USING btree (due_date);


--
-- Name: idx_service_requests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_requests_status ON public.service_requests USING btree (status);


--
-- Name: clients update_clients_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: documents update_documents_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: service_requests update_service_requests_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();


--
-- Name: activities activities_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: activities activities_document_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_document_id_fkey FOREIGN KEY (document_id) REFERENCES public.documents(id) ON DELETE CASCADE;


--
-- Name: activities activities_service_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_service_request_id_fkey FOREIGN KEY (service_request_id) REFERENCES public.service_requests(id) ON DELETE CASCADE;


--
-- Name: activities activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activities
    ADD CONSTRAINT activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id);


--
-- Name: clients clients_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: clients clients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.clients
    ADD CONSTRAINT clients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE SET NULL;


--
-- Name: documents documents_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: documents documents_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id);


--
-- Name: documents documents_service_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_service_request_id_fkey FOREIGN KEY (service_request_id) REFERENCES public.service_requests(id) ON DELETE CASCADE;


--
-- Name: documents documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id);


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_assigned_to_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES public.profiles(id);


--
-- Name: service_requests service_requests_client_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id);


--
-- Name: profiles Admin can manage all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin can manage all profiles" ON public.profiles USING ((public.get_user_role(auth.uid()) = 'admin'::public.user_role));


--
-- Name: clients Admin/Staff can manage clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can manage clients" ON public.clients USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: documents Admin/Staff can manage documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can manage documents" ON public.documents USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: service_requests Admin/Staff can manage service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can manage service requests" ON public.service_requests USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: activities Admin/Staff can view all activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can view all activities" ON public.activities FOR SELECT USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: clients Admin/Staff can view all clients; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can view all clients" ON public.clients FOR SELECT USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: documents Admin/Staff can view all documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can view all documents" ON public.documents FOR SELECT USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: profiles Admin/Staff can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can view all profiles" ON public.profiles FOR SELECT USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: service_requests Admin/Staff can view all service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admin/Staff can view all service requests" ON public.service_requests FOR SELECT USING (public.is_admin_or_staff(auth.uid()));


--
-- Name: documents Clients can upload documents for their requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Clients can upload documents for their requests" ON public.documents FOR INSERT WITH CHECK ((client_id IN ( SELECT clients.id
   FROM public.clients
  WHERE (clients.user_id = auth.uid()))));


--
-- Name: activities Clients can view their own activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Clients can view their own activities" ON public.activities FOR SELECT USING ((client_id IN ( SELECT clients.id
   FROM public.clients
  WHERE (clients.user_id = auth.uid()))));


--
-- Name: documents Clients can view their own documents; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Clients can view their own documents" ON public.documents FOR SELECT USING ((client_id IN ( SELECT clients.id
   FROM public.clients
  WHERE (clients.user_id = auth.uid()))));


--
-- Name: clients Clients can view their own record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Clients can view their own record" ON public.clients FOR SELECT USING ((user_id = auth.uid()));


--
-- Name: service_requests Clients can view their own service requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Clients can view their own service requests" ON public.service_requests FOR SELECT USING ((client_id IN ( SELECT clients.id
   FROM public.clients
  WHERE (clients.user_id = auth.uid()))));


--
-- Name: activities System can insert activities; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert activities" ON public.activities FOR INSERT WITH CHECK (true);


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: profiles Users can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: activities; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

--
-- Name: clients; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

--
-- Name: documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: service_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


