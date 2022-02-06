package com.rozelux.springbootstrapmvc.DAO;

import com.rozelux.springbootstrapmvc.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository <User,Long> {
    User findUserByMail (String mail);
}
