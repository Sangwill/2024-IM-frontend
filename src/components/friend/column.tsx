import { useEffect, useState } from "react";
import { request } from "../../utils/network";
import styles from "../../styles/layout.module.css";
import { Avatar, Skeleton, Spin ,Collapse} from "antd";
import { store } from "../../utils/store";
const { Panel } = Collapse;
interface Friend {
  friend_id: number;
  friend_name: string;
  friend_avatar: string;
}

interface FriendGroup {
  group_name: string;
  group_friends: Friend[];
}

interface FriendListProps {
  list?: FriendGroup[]; // 更新 FriendListProps 的 list 类型
  setProfile?: any;
}

const FriendList = (props: FriendListProps) => {
    
  const header = {
    Authorization: store.getState().token,
  };

  const handleSelect = async (friend: Friend) => {
    const { friend_id } = friend;
    const selectedUser = props.list?.flatMap((group) => group.group_friends).find((f) => f.friend_id === friend_id);
    if (selectedUser) {
      const username = selectedUser.friend_name;
      const url = `user/profile/${username}`;
      try {
        const response = await request("GET", url, "", header);
        const profile = {
          user_id: response?.user_id,
          username: response?.username,
          email: response?.email,
          phone: response?.phone,
          avatar_base64: response?.avatar_base64,
          is_friend: response?.is_friend,
        };
        props.setProfile(profile);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div style={{ maxHeight: "600px", overflowY: "auto" }}>
      {props.list?.map((group) => (
        <div key={group.group_name}>
          <div>好友分组：{group.group_name}</div>
          {group.group_friends.map((friend) => (
            <div className={styles.column_item} key={friend.friend_id} onClick={() => handleSelect(friend)}>
              <img className={styles.column_item_left} src={friend.friend_avatar} />
              {friend.friend_name}
            </div>
            
          ))}
        </div>
      ))}
    </div>
  );
};

interface ColumnProps {
  setProfile?: any;
  page: string;
}

function Column(props: ColumnProps) {
  const [friends, setFriends] = useState<FriendGroup[]>();

  const handleQuery = async () => {
    const url = "user/get_friends";
    const header = {
      Authorization: store.getState().token,
    };
    try {
        const response = await request("GET", url, "", header);
        setFriends(response?.groups); // 更新为新的字段名
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleQuery();
  }, []);

  return (
    <div className={styles.column}>
      <FriendList list={friends} setProfile={props.setProfile} />
    </div>
  );
}

export default Column;