CREATE TYPE "public"."event_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'SOLD_OUT', 'FINISHED');--> statement-breakpoint
CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."organizer_role_enum" AS ENUM('OWNER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."payment_method_enum" AS ENUM('PIX', 'DEBIT_CARD', 'CREDIT_CARD', 'BOLETO');--> statement-breakpoint
CREATE TABLE "Audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar(50) NOT NULL,
	"old_value" jsonb,
	"new_value" jsonb,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Organizer_members" (
	"user_id" uuid NOT NULL,
	"organizer_id" uuid NOT NULL,
	"role" "organizer_role_enum" NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "Organizer_members_user_id_organizer_id_pk" PRIMARY KEY("user_id","organizer_id")
);
--> statement-breakpoint
CREATE TABLE "Organizer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cnpj" varchar(18) NOT NULL,
	"name" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "Organizer_cnpj_unique" UNIQUE("cnpj")
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cpf" varchar(14) NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"telephone" varchar(20),
	"password_hash" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true,
	CONSTRAINT "User_cpf_unique" UNIQUE("cpf"),
	CONSTRAINT "User_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "Category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "Event_artist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"image_url" text
);
--> statement-breakpoint
CREATE TABLE "Event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"venue_id" uuid NOT NULL,
	"organizer_id" uuid NOT NULL,
	"slug" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"banner_url" text,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" "event_status_enum" DEFAULT 'DRAFT' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "Event_slug_unique" UNIQUE("slug"),
	CONSTRAINT "chk_event_dates" CHECK ("Event"."ends_at" > "Event"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "Ticket_type" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"total_quantity" integer NOT NULL,
	"sold_quantity" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chk_price_positive" CHECK ("Ticket_type"."price" >= 0),
	CONSTRAINT "chk_quantities" CHECK ("Ticket_type"."total_quantity" >= 0 AND "Ticket_type"."sold_quantity" >= 0),
	CONSTRAINT "chk_sold_limit" CHECK ("Ticket_type"."sold_quantity" <= "Ticket_type"."total_quantity")
);
--> statement-breakpoint
CREATE TABLE "Venue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(50) NOT NULL,
	"cep" varchar(20) NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "Order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"ticket_type_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"unit_price" numeric(10, 2) NOT NULL,
	CONSTRAINT "chk_quantity_positive" CHECK ("Order_items"."quantity" > 0),
	CONSTRAINT "chk_unit_price_positive" CHECK ("Order_items"."unit_price" >= 0)
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "order_status_enum" DEFAULT 'PENDING' NOT NULL,
	"payment_method" "payment_method_enum" NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "chk_total_amount_positive" CHECK ("Order"."total_amount" >= 0)
);
--> statement-breakpoint
ALTER TABLE "Audit_log" ADD CONSTRAINT "Audit_log_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Organizer_members" ADD CONSTRAINT "Organizer_members_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Organizer_members" ADD CONSTRAINT "Organizer_members_organizer_id_Organizer_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event_artist" ADD CONSTRAINT "Event_artist_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_category_id_Category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."Category"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_venue_id_Venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."Venue"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_Organizer_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."Organizer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Ticket_type" ADD CONSTRAINT "Ticket_type_event_id_Event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."Event"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order_items" ADD CONSTRAINT "Order_items_order_id_Order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."Order"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order_items" ADD CONSTRAINT "Order_items_ticket_type_id_Ticket_type_id_fk" FOREIGN KEY ("ticket_type_id") REFERENCES "public"."Ticket_type"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_User_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_audit_log_entity" ON "Audit_log" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_category_slug" ON "Category" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_event_slug" ON "Event" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_event_status_starts_at" ON "Event" USING btree ("status","starts_at");--> statement-breakpoint
CREATE INDEX "idx_event_category_id" ON "Event" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "idx_event_venue_id" ON "Event" USING btree ("venue_id");--> statement-breakpoint
CREATE INDEX "idx_event_organizer_id" ON "Event" USING btree ("organizer_id");--> statement-breakpoint
CREATE INDEX "idx_ticket_type_event_id" ON "Ticket_type" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_order_id" ON "Order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_order_items_ticket_type_id" ON "Order_items" USING btree ("ticket_type_id");--> statement-breakpoint
CREATE INDEX "idx_order_user_id" ON "Order" USING btree ("user_id");