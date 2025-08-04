from typing import Dict, List, Any, Optional


class TodoService:
    """Todoアプリケーションのビジネスロジックを管理するサービスクラス"""
    
    def __init__(self):
        """サービスの初期化"""
        self.todos: List[Dict[str, Any]] = []
        self.categories: List[Dict[str, Any]] = []
        self.todo_categories: List[Dict[str, int]] = []
        self.next_todo_id: int = 1
        self.next_category_id: int = 1
    
    def add_todo(self, title: str, category_ids: Optional[List[int]] = None) -> bool:
        """
        新しいTodoを追加
        
        Args:
            title: Todoのタイトル
            category_ids: 関連付けるカテゴリIDのリスト
            
        Returns:
            bool: 追加に成功した場合True
        """
        if not title.strip():
            return False
            
        new_todo = {
            'id': self.next_todo_id,
            'title': title.strip(),
            'state': 'todo'
        }
        self.todos.append(new_todo)
        
        if category_ids:
            for category_id in category_ids:
                self.todo_categories.append({
                    'todo_id': self.next_todo_id,
                    'category_id': category_id
                })
        
        self.next_todo_id += 1
        return True
    
    def add_category(self, title: str) -> bool:
        """
        新しいカテゴリを追加
        
        Args:
            title: カテゴリのタイトル
            
        Returns:
            bool: 追加に成功した場合True
        """
        if not title.strip():
            return False
            
        new_category = {
            'id': self.next_category_id,
            'title': title.strip()
        }
        self.categories.append(new_category)
        self.next_category_id += 1
        return True
    
    def get_todo_categories(self, todo_id: int) -> List[Dict[str, Any]]:
        """
        指定されたTodoのカテゴリを取得
        
        Args:
            todo_id: TodoのID
            
        Returns:
            List[Dict[str, Any]]: カテゴリのリスト
        """
        todo_category_ids = [
            tc['category_id'] for tc in self.todo_categories 
            if tc['todo_id'] == todo_id
        ]
        return [
            cat for cat in self.categories 
            if cat['id'] in todo_category_ids
        ]
    
    def get_filtered_todos(self, filter_state: str = "all", 
                          filter_category: Optional[int] = None) -> List[Dict[str, Any]]:
        """
        フィルター条件に基づいてTodoを取得
        
        Args:
            filter_state: 状態フィルター ("all", "todo", "done")
            filter_category: カテゴリフィルター (None の場合は全カテゴリ)
            
        Returns:
            List[Dict[str, Any]]: フィルターされたTodoのリスト
        """
        todos = self.todos.copy()
        
        # 状態でフィルター
        if filter_state != "all":
            todos = [todo for todo in todos if todo['state'] == filter_state]
        
        # カテゴリでフィルター
        if filter_category is not None:
            category_todo_ids = [
                tc['todo_id'] for tc in self.todo_categories 
                if tc['category_id'] == filter_category
            ]
            todos = [todo for todo in todos if todo['id'] in category_todo_ids]
        
        return todos
    
    def update_todo_state(self, todo_id: int, new_state: str) -> bool:
        """
        Todoの状態を更新
        
        Args:
            todo_id: TodoのID
            new_state: 新しい状態 ("todo", "done")
            
        Returns:
            bool: 更新に成功した場合True
        """
        for todo in self.todos:
            if todo['id'] == todo_id:
                todo['state'] = new_state
                return True
        return False
    
    def delete_todo(self, todo_id: int) -> bool:
        """
        Todoを削除
        
        Args:
            todo_id: TodoのID
            
        Returns:
            bool: 削除に成功した場合True
        """
        # Todoを削除
        original_count = len(self.todos)
        self.todos = [todo for todo in self.todos if todo['id'] != todo_id]
        
        # 関連するカテゴリの関連付けも削除
        self.todo_categories = [
            tc for tc in self.todo_categories 
            if tc['todo_id'] != todo_id
        ]
        
        return len(self.todos) < original_count
    
    def get_statistics(self) -> Dict[str, int]:
        """
        統計情報を取得
        
        Returns:
            Dict[str, int]: 統計情報 (total, todo, done)
        """
        total_todos = len(self.todos)
        done_todos = len([t for t in self.todos if t['state'] == 'done'])
        todo_todos = total_todos - done_todos
        
        return {
            'total': total_todos,
            'todo': todo_todos,
            'done': done_todos
        }
    
    def get_all_todos(self) -> List[Dict[str, Any]]:
        """
        全てのTodoを取得
        
        Returns:
            List[Dict[str, Any]]: Todoのリスト
        """
        return self.todos.copy()
    
    def get_all_categories(self) -> List[Dict[str, Any]]:
        """
        全てのカテゴリを取得
        
        Returns:
            List[Dict[str, Any]]: カテゴリのリスト
        """
        return self.categories.copy()
    
    def get_debug_info(self) -> Dict[str, Any]:
        """
        デバッグ情報を取得
        
        Returns:
            Dict[str, Any]: デバッグ情報
        """
        return {
            "total_todos": len(self.todos),
            "next_todo_id": self.next_todo_id,
            "total_categories": len(self.categories),
            "next_category_id": self.next_category_id,
            "todos": self.todos,
            "categories": self.categories,
            "todo_categories": self.todo_categories
        }
    
    def load_state(self, state_data: Dict[str, Any]) -> None:
        """
        状態データを読み込み
        
        Args:
            state_data: 状態データの辞書
        """
        self.todos = state_data.get('todos', [])
        self.categories = state_data.get('categories', [])
        self.todo_categories = state_data.get('todo_categories', [])
        self.next_todo_id = state_data.get('next_todo_id', 1)
        self.next_category_id = state_data.get('next_category_id', 1)
    
    def get_state(self) -> Dict[str, Any]:
        """
        現在の状態を取得
        
        Returns:
            Dict[str, Any]: 現在の状態データ
        """
        return {
            'todos': self.todos,
            'categories': self.categories,
            'todo_categories': self.todo_categories,
            'next_todo_id': self.next_todo_id,
            'next_category_id': self.next_category_id
        }