----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- SCHEMA

CREATE SCHEMA IF NOT EXISTS "CheatSheet";
ALTER USER ocmgxpde SET search_path="CheatSheet";
SET search_path TO "CheatSheet"; -- probably not necessary cause the search_path has been altered for this specific user


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- TABLES

CREATE TABLE IF NOT EXISTS users (
	id serial PRIMARY KEY,
	fullname text NOT NULL,
	email text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS userLocal (
	userid int PRIMARY KEY references users(id),
	passwordhash text NOT NULL,
	username text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS userFb (
	userid int PRIMARY KEY references users(id),
	facebookid int NOT NULL UNIQUE,
	token text NOT NULL
);

CREATE TABLE IF NOT EXISTS schools (
	id serial PRIMARY KEY,
	name text NOT NULL
);

CREATE TABLE IF NOT EXISTS departments (
	id serial PRIMARY KEY,
	name text NOT NULL,
	schoolid int NOT NULL references schools(id)
);

CREATE TABLE IF NOT EXISTS majors (
	id serial PRIMARY KEY,
	name text NOT NULL,
	departmentid int NOT NULL references departments(id)
);

CREATE TABLE IF NOT EXISTS summaryComments (
	id serial PRIMARY KEY,
	authorid int references users(id),
	content text NOT NULL,
	parentId int NOT NULL DEFAULT 0,
	dateCreated timestamp with time zone NOT NULL,
	voteCount int NOT NULL DEFAULT 0,
	datemodified timestamp with time zone NOT NULL,
	parentContentId int NOT NULL
);

CREATE TABLE IF NOT EXISTS courseComments (
	id serial PRIMARY KEY,
	authorid int references users(id),
	content text NOT NULL,
	parentId int NOT NULL DEFAULT 0,
	dateCreated timestamp with time zone NOT NULL,
	voteCount int NOT NULL DEFAULT 0,
	datemodified timestamp with time zone NOT NULL,
	parentContentId int NOT NULL
);

CREATE TABLE IF NOT EXISTS commentVotes (
	userid int references users(id),
	value int NOT NULL,
	parentid int NOT NULL,
	type text NOT NULL,
	PRIMARY KEY(userid, parentid, type)
);

CREATE TABLE IF NOT EXISTS summaryVotes (
	userid int references users(id),
	value int NOT NULL,
	parentid int NOT NULL,
	PRIMARY KEY(userid, parentid)
);

CREATE TABLE IF NOT EXISTS courses (
	id serial PRIMARY KEY,
	name text NOT NULL,
	identificationcode text NOT NULL,
	majorid int NOT NULL references majors(id)
);

CREATE TABLE IF NOT EXISTS summaries (
	id serial PRIMARY KEY,
	content text NOT NULL,
	datecreated timestamp with time zone NOT NULL,
	authorid int NOT NULL references users(id),
	votecount int NOT NULL DEFAULT 0,
	teachername text NOT NULL,
	datemodified timestamp with time zone NOT NULL,
	attendancedate timestamp with time zone NOT NULL,
	courseid int NOT NULL references courses(id)
);

CREATE TABLE IF NOT EXISTS hotbarelements (
	userid integer NOT NULL,
	elementid integer NOT NULL,
	type text NOT NULL,
	contentname text NOT NULL
);

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- FUNCTIONS

-- tries to insert new vote into commentVotes, if it already exists it updates that vote instead by calling update_commentVotes() and terminates the insert procedure
CREATE OR REPLACE FUNCTION upsert_commentVotes() RETURNS TRIGGER AS $$
	BEGIN
		IF NOT EXISTS (SELECT * FROM commentVotes WHERE userId=NEW.userId AND parentId=NEW.parentId AND type=NEW.type) THEN
			IF NEW.type = 'course' THEN	
				UPDATE courseComments SET voteCount = voteCount + NEW.value WHERE id = NEW.parentId;
			ELSIF NEW.type = 'summary' THEN
				UPDATE summaryComments SET voteCount = voteCount + NEW.value WHERE id = NEW.parentId;
			END IF;
			RETURN NEW;
		END IF;
		UPDATE commentVotes SET value=NEW.value WHERE userId=NEW.userId AND parentId=NEW.parentId AND type=NEW.type;
	RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

-- updates the vote in commentVotes. The value inserted depends on if it's a course/summary comment, if the previous vote was +1 or -1 and if the new vote is +1 or -1;
CREATE OR REPLACE FUNCTION update_commentVotes() RETURNS TRIGGER AS $$
	BEGIN
		IF NEW.value <> OLD.value THEN
			IF NEW.type = 'course' THEN
				UPDATE courseComments SET voteCount = voteCount + NEW.value - OLD.value WHERE id = NEW.parentId;
			ELSIF NEW.type = 'summary' THEN
				UPDATE summaryComments SET voteCount = voteCount + NEW.value - OLD.value WHERE id = NEW.parentId;
			END IF;
		ELSE
			NEW.value := 0;
			IF NEW.type = 'course' THEN
				UPDATE courseComments SET voteCount = voteCount - OLD.value WHERE id = NEW.parentId;
			ELSIF NEW.type = 'summary' THEN
				UPDATE summaryComments SET voteCount = voteCount - OLD.value WHERE id = NEW.parentId;
			END IF;
		END IF;
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

-- tries to insert new vote into summaryVotes, if it already exists it updates that vote instead by calling update_summaryVotes() and terminates the insert procedure
CREATE OR REPLACE FUNCTION upsert_summaryVotes() RETURNS TRIGGER AS $$
	BEGIN
		IF NOT EXISTS (SELECT * FROM summaryVotes WHERE userId=NEW.userId AND parentId=NEW.parentId) THEN
			UPDATE summaries SET voteCount = voteCount + NEW.value WHERE id = NEW.parentId;
			RETURN NEW;
		END IF;
		UPDATE summaryVotes SET value=NEW.value WHERE userId=NEW.userId AND parentId=NEW.parentId;
	RETURN NULL;
	END;
$$ LANGUAGE plpgsql;

-- updates the vote in summaryVotes. The value inserted depends on if it's a course/summary comment, if the previous vote was +1 or -1 and if the new vote is +1 or -1;
CREATE OR REPLACE FUNCTION update_summaryVotes() RETURNS TRIGGER AS $$
	BEGIN
		IF NEW.value <> OLD.value THEN
			UPDATE summaries SET voteCount = voteCount + NEW.value - OLD.value WHERE id = NEW.parentId;
		ELSE
			NEW.value := 0;
			UPDATE summaries SET voteCount = voteCount - OLD.value WHERE id = NEW.parentId;
		END IF;
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- TRIGGERS

CREATE TRIGGER insert_on_commentVotes BEFORE INSERT ON commentVotes
FOR EACH ROW EXECUTE PROCEDURE upsert_commentVotes();

CREATE TRIGGER update_on_commentVotes BEFORE UPDATE ON commentVotes
FOR EACH ROW EXECUTE PROCEDURE update_commentVotes();

CREATE TRIGGER insert_on_summaryVotes BEFORE INSERT ON summaryVotes
FOR EACH ROW EXECUTE PROCEDURE upsert_summaryVotes();

CREATE TRIGGER update_on_summaryVotes BEFORE UPDATE ON summaryVotes
FOR EACH ROW EXECUTE PROCEDURE update_summaryVotes();



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
-- DROP EVERYTHING
/*
SET search_path TO "CheatSheet";

--DROP TABLE IF EXISTS users CASCADE;
--DROP TABLE IF EXISTS userFb CASCADE;
--DROP TABLE IF EXISTS userLocal CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS majors CASCADE;
DROP TABLE IF EXISTS summaryComments CASCADE;
DROP TABLE IF EXISTS courseComments CASCADE;
DROP TABLE IF EXISTS commentVotes CASCADE;
DROP TABLE IF EXISTS summaryVotes CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS summaries CASCADE;
*/