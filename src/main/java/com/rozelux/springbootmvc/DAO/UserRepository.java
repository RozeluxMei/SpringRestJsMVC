package com.rozelux.springbootmvc.DAO;

import com.rozelux.springbootmvc.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface UserRepository extends JpaRepository <User,Long> {
    User findUserByUsername (String username);
}
