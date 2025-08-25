from rest_framework.permissions import BasePermission


class IsBoardOwnerOrMember(BasePermission):
    """
    Custom permission to only allow board owners or members to access board-related objects.
    - Read permissions: Board owner or members
    - Write permissions: Board owner only
    """
    
    def has_object_permission(self, request, view, obj):
        # Determine the board object based on the object type
        if hasattr(obj, 'owner'):  # Board object
            board = obj
        elif hasattr(obj, 'board'):  # List object
            board = obj.board
        elif hasattr(obj, 'list'):  # Card object
            board = obj.list.board
        else:
            return False
            
        # Read permissions for owner and members
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return board.owner == request.user or request.user in board.members.all()
        
        # Write permissions only for owner
        return board.owner == request.user