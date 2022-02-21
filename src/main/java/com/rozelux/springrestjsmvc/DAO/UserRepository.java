package com.rozelux.springrestjsmvc.DAO;

import com.rozelux.springrestjsmvc.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository <User,Long> {
    User findUserByMail (String mail);
}
