create table users(
	id varchar(36) PRIMARY KEY,
	login varchar(255) not null,
	password varchar(255) not null,
	isadmin boolean default false
);
create table tasks(
	id varchar(36) PRIMARY KEY,
	title text not null,
  completed boolean default false
);