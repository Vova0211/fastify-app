create table Users(
	id varchar(36) PRIMARY KEY,
	login varchar(255) not null unique,
	password varchar(255) not null,
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
create table Items(
	id varchar(36) PRIMARY KEY,
	title text not null,
  completed boolean default false,
	user_id varchar(36),
	createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	foreign key (user_id) references Users (id)
);