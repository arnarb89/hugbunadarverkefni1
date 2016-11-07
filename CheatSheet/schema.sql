
CREATE TABLE IF NOT EXISTS users (
	id serial PRIMARY KEY,
	fullname text,
	email text NOT NULL UNIQUE,
	username text NOT NULL UNIQUE,
	password text NOT NULL	
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
	parentId int NOT NULL,
	dateCreated timestamp with time zone NOT NULL,
	voteCount int NOT NULL,
	datemodified timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS courseComments (
	id serial PRIMARY KEY,
	authorid int references users(id),
	content text NOT NULL,
	parentId int NOT NULL,
	dateCreated timestamp with time zone NOT NULL,
	voteCount int NOT NULL,
	datemodified timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS commentVotes (
	userid int references users(id),
	value int NOT NULL,
	parentid int NOT NULL,
	PRIMARY KEY(userid, parentid)
);

CREATE TABLE IF NOT EXISTS courseVotes (
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
	votecount int NOT NULL,
	teachername text NOT NULL,
	datemodified timestamp with time zone NOT NULL,
	attendancedate timestamp with time zone NOT NULL,
	courseid int NOT NULL references courses(id)
);